import { readFile, writeFile } from 'node:fs/promises';

import { buildXml } from '../utils/xmlBuilder.js';
import { PackageManifestObject } from './types.js';

export type ConvertListToXmlResult = {
  packageXml: string;
  warnings: string[];
  types: number;
};

/**
 * Converts package list text to package.xml text, in memory. An empty list
 * yields an empty package.xml. Malformed lines are skipped and reported in
 * `warnings`; this function does not throw on bad input.
 */
export function convertListToXml(
  list: string,
  { noApiVersion = false }: { noApiVersion?: boolean } = {},
): ConvertListToXmlResult {
  const warnings: string[] = [];
  const packageJson = parseListLines(list.split('\n'), noApiVersion, warnings);
  return { packageXml: buildXmlString(packageJson), warnings, types: packageJson.Package.types.length };
}

export async function listToPackageXml({
  listPath,
  xmlPath,
  noApiVersion,
}: {
  listPath?: string;
  xmlPath: string;
  noApiVersion: boolean;
}): Promise<{ xmlPath: string; warnings: string[]; types: number }> {
  const warnings: string[] = [];

  let listString = '';
  if (listPath) {
    try {
      listString = await readFile(listPath, 'utf-8');
    } catch {
      warnings.push(`List file "${listPath}" could not be read. Using empty package.xml.`);
    }
  } else {
    warnings.push('No list file provided. Using empty package.xml.');
  }

  const result = convertListToXml(listString, { noApiVersion });
  await writeFile(xmlPath, result.packageXml);
  return { xmlPath, warnings: [...warnings, ...result.warnings], types: result.types };
}

function buildXmlString(packageJson: PackageManifestObject): string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + buildXml(packageJson);
}

function parseListLines(lines: string[], noApiVersion: boolean, warnings: string[]): PackageManifestObject {
  const packageJson: PackageManifestObject = {
    Package: {
      '@_xmlns': 'http://soap.sforce.com/2006/04/metadata',
      types: [],
      version: undefined,
    },
  };

  // Repeated type lines merge into one <types> entry. Map and Set keep first-appearance
  // order for types and members, so lists without duplicates convert exactly as before.
  const membersByType = new Map<string, Set<string>>();

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const parts = trimmedLine.split(':');
    if (parts.length < 2) {
      warnings.push(`Line does not match expected package list format and will be skipped: ${line}`);
      continue;
    }

    const [key, values] = parts.map((s) => s.trim());

    if (key.toLowerCase() === 'version') {
      if (!noApiVersion) {
        packageJson.Package.version = values;
      }
      continue;
    }

    const members = values
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (members.length === 0) {
      warnings.push(`Line has no members and will be skipped: ${line}`);
      continue;
    }

    const existing = membersByType.get(key) ?? new Set<string>();
    members.forEach((member) => existing.add(member));
    membersByType.set(key, existing);
  }

  for (const [name, members] of membersByType) {
    packageJson.Package.types.push({ members: [...members], name });
  }

  return packageJson;
}
