import { ManifestResolver } from '@salesforce/source-deploy-retrieve';

export async function packageXmlToList(
  filePath: string | undefined,
  noApiVersion: boolean
): Promise<{ packageList: string; warnings: string[] }> {
  const resolver = new ManifestResolver();
  let packageList = '';
  let apiVersion = '';
  const warnings: string[] = [];

  if (!filePath) {
    warnings.push('No package.xml file path was provided. Creating empty list file.');
    return { packageList, warnings };
  }

  const resolvedManifest = await resolver.resolve(filePath);

  if (!resolvedManifest || resolvedManifest.components.length === 0) {
    warnings.push('The provided package is invalid or has no components. Creating empty list file.');
    return { packageList, warnings };
  }

  // Extract API version if noApiVersion is false
  if (resolvedManifest.apiVersion && !noApiVersion) {
    apiVersion = resolvedManifest.apiVersion;
  }

  // Extract metadata components
  const metadataTypes = new Map<string, string[]>(); // Type -> Full Names

  for (const component of resolvedManifest.components) {
    if (!metadataTypes.has(component.type.name)) {
      metadataTypes.set(component.type.name, []);
    }
    metadataTypes.get(component.type.name)!.push(component.fullName);
  }

  // Convert metadata map to list format
  packageList = Array.from(metadataTypes.entries())
    .map(([type, members]) => `${type}: ${members.join(', ')}`)
    .join('\n');

  if (apiVersion) {
    packageList += `\nVersion: ${apiVersion}`;
  }

  return { packageList, warnings };
}
