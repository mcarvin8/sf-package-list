import { readFile, writeFile } from 'node:fs/promises';

import { ParsedManifest, parseManifestXml } from './parseManifest.js';

export type ConvertXmlToListResult = {
  packageList: string;
  warnings: string[];
};

// An invalid manifest yields `error`; a valid one with no types yields an empty `packageList`.
type XmlToListOutcome = { packageList: string; error?: undefined } | { error: string };

/**
 * Converts package.xml text to package list text, in memory. An invalid
 * manifest or one with no types yields an empty list and a warning; this
 * function does not throw on bad input.
 */
export function convertXmlToList(
  xml: string,
  { noApiVersion = false }: { noApiVersion?: boolean } = {},
): ConvertXmlToListResult {
  const outcome = xmlToList(xml, noApiVersion);
  if (outcome.error !== undefined) {
    return {
      packageList: '',
      warnings: [`The provided package is invalid. Returning an empty list. ${outcome.error}`],
    };
  }
  if (outcome.packageList === '') {
    return { packageList: '', warnings: ['The provided package has no components. Returning an empty list.'] };
  }
  return { packageList: outcome.packageList, warnings: [] };
}

export async function packageXmlToList({
  xmlPath,
  listPath,
  noApiVersion,
}: {
  xmlPath?: string;
  listPath: string;
  noApiVersion: boolean;
}): Promise<{ packageList: string; warnings: string[] }> {
  const warnings: string[] = [];
  let packageList = '';

  if (!xmlPath) {
    warnings.push('No package.xml file path was provided. Creating empty list file.');
  } else {
    let outcome: XmlToListOutcome;
    try {
      outcome = xmlToList(await readFile(xmlPath, 'utf-8'), noApiVersion);
    } catch (err) {
      outcome = { error: errorMessage(err) };
    }

    if (outcome.error !== undefined) {
      warnings.push(`The provided package is invalid or could not be read. Creating empty list file. ${outcome.error}`);
    } else if (outcome.packageList === '') {
      warnings.push('The provided package is invalid or has no components. Creating empty list file.');
    } else {
      packageList = outcome.packageList;
    }
  }

  await writeFile(listPath, packageList);
  return { packageList, warnings };
}

function xmlToList(xml: string, noApiVersion: boolean): XmlToListOutcome {
  let manifest: ParsedManifest;
  try {
    manifest = parseManifestXml(xml);
  } catch (err) {
    return { error: errorMessage(err) };
  }
  // A manifest with a <version> but no types would otherwise build a "Version: x" line.
  if (manifest.types.length === 0) {
    return { packageList: '' };
  }
  return { packageList: buildPackageList(manifest, noApiVersion) };
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function buildPackageList(manifest: ParsedManifest, noApiVersion: boolean): string {
  const lines = manifest.types.map((type) => `${type.name}: ${type.members.join(', ')}`);

  if (manifest.version && !noApiVersion) {
    lines.push(`Version: ${manifest.version}`);
  }

  return lines.join('\n');
}
