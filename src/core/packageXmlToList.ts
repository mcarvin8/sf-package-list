import { readFile, writeFile } from 'node:fs/promises';

import { ParsedManifest, parseManifestXml } from './parseManifest.js';

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

  if (!xmlPath) {
    warnings.push('No package.xml file path was provided. Creating empty list file.');
    await writeFile(listPath, '');
    return { packageList: '', warnings };
  }

  try {
    const xml = await readFile(xmlPath, 'utf-8');
    const manifest = parseManifestXml(xml);

    if (manifest.types.length === 0) {
      warnings.push('The provided package is invalid or has no components. Creating empty list file.');
      await writeFile(listPath, '');
      return { packageList: '', warnings };
    }

    const packageList = buildPackageList(manifest, noApiVersion);
    await writeFile(listPath, packageList);
    return { packageList, warnings };
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err);
    warnings.push(`The provided package is invalid or could not be read. Creating empty list file. ${errMessage}`);
    await writeFile(listPath, '');
    return { packageList: '', warnings };
  }
}

function buildPackageList(manifest: ParsedManifest, noApiVersion: boolean): string {
  const lines = manifest.types.map((type) => `${type.name}: ${type.members.join(', ')}`);

  if (manifest.version && !noApiVersion) {
    lines.push(`Version: ${manifest.version}`);
  }

  return lines.join('\n');
}
