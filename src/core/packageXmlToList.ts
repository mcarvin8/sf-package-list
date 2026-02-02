import { writeFile } from 'node:fs/promises';
import { ComponentSet } from '@salesforce/source-deploy-retrieve';

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
    const componentSet = await ComponentSet.fromManifest({ manifestPath: xmlPath });
    const metadataTypes = groupComponentsByType(componentSet);

    if (metadataTypes.size === 0) {
      warnings.push('The provided package is invalid or has no components. Creating empty list file.');
      await writeFile(listPath, '');
      return { packageList: '', warnings };
    }

    const packageList = buildPackageList(metadataTypes, componentSet.sourceApiVersion, noApiVersion);
    await writeFile(listPath, packageList);
    return { packageList, warnings };
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err);
    warnings.push(`The provided package is invalid or could not be read. Creating empty list file. ${errMessage}`);
    await writeFile(listPath, '');
    return { packageList: '', warnings };
  }
}

function buildPackageList(
  metadataTypes: Map<string, string[]>,
  apiVersion: string | undefined,
  noApiVersion: boolean
): string {
  const lines = Array.from(metadataTypes.entries()).map(([type, members]) => `${type}: ${members.join(', ')}`);

  if (apiVersion && !noApiVersion) {
    lines.push(`Version: ${apiVersion}`);
  }

  return lines.join('\n');
}

function groupComponentsByType(components: ComponentSet): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const component of components) {
    const typeName = component.type.name;
    if (!map.has(typeName)) {
      map.set(typeName, []);
    }
    map.get(typeName)!.push(component.fullName);
  }
  return map;
}
