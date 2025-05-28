import { writeFile } from 'node:fs/promises';
import { ComponentSet } from '@salesforce/source-deploy-retrieve';

export async function packageXmlToList(
  xmlPath: string | undefined,
  listPath: string,
  noApiVersion: boolean
): Promise<{ packageList: string; warnings: string[] }> {
  const warnings: string[] = [];
  let packageList: string;

  if (!xmlPath) {
    warnings.push('No package.xml file path was provided. Creating empty list file.');
  }

  if (xmlPath) {
    let componentSet: ComponentSet;
    try {
      componentSet = await ComponentSet.fromManifest({ manifestPath: xmlPath });
    } catch (err) {
      warnings.push('The provided package is invalid or has no components. Creating empty list file.');
      return { packageList: '', warnings };
    }

    const metadataTypes = groupComponentsByType(componentSet);
    if (metadataTypes.size === 0) {
      warnings.push('The provided package is invalid or has no components. Creating empty list file.');
      return { packageList: '', warnings };
    }

    packageList = buildPackageList(metadataTypes, componentSet.sourceApiVersion, noApiVersion);
  } else {
    packageList = '';
  }
  await writeFile(listPath, packageList);
  return { packageList, warnings };
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
