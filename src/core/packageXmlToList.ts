import { readFile, writeFile } from 'node:fs/promises';

import { ParsedManifest, parseManifestXml } from './parseManifest.js';

export type ConvertXmlToListResult = {
  packageList: string;
  warnings: string[];
};

type XmlToListOutcome =
  | { ok: true; packageList: string }
  | { ok: false; reason: 'empty' }
  | { ok: false; reason: 'invalid'; message: string };

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
  if (outcome.ok) {
    return { packageList: outcome.packageList, warnings: [] };
  }
  const warning =
    outcome.reason === 'empty'
      ? 'The provided package has no components. Returning an empty list.'
      : `The provided package is invalid. Returning an empty list. ${outcome.message}`;
  return { packageList: '', warnings: [warning] };
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
      outcome = { ok: false, reason: 'invalid', message: errorMessage(err) };
    }

    if (outcome.ok) {
      packageList = outcome.packageList;
    } else if (outcome.reason === 'empty') {
      warnings.push('The provided package is invalid or has no components. Creating empty list file.');
    } else {
      warnings.push(
        `The provided package is invalid or could not be read. Creating empty list file. ${outcome.message}`,
      );
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
    return { ok: false, reason: 'invalid', message: errorMessage(err) };
  }
  if (manifest.types.length === 0) {
    return { ok: false, reason: 'empty' };
  }
  return { ok: true, packageList: buildPackageList(manifest, noApiVersion) };
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
