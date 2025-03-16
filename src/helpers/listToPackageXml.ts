import { readFile } from 'node:fs/promises';
import { PackageManifestObject } from '@salesforce/source-deploy-retrieve';
import { XMLBuilder } from 'fast-xml-parser';

export async function listToPackageXml(list: string): Promise<string> {
  // Read the content of the file
  const listString = await readFile(list, 'utf-8');
  
  // Split the file content by newlines
  const lines = listString.split('\n');
  const packageJson: PackageManifestObject = { Package: { '@_xmlns': 'http://soap.sforce.com/2006/04/metadata', types: [], version: '0.0' } };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; // Skip empty lines

    // Ensure that line contains a ':'
    const parts = trimmedLine.split(':');
    if (parts.length < 2) {
      continue; // Skip invalid lines
    }

    const [key, values] = parts.map(s => s.trim());
    if (key.toLowerCase() === 'version') {
      packageJson.Package.version = values;
    } else {
      packageJson.Package.types.push({
        members: values.split(',').map(v => v.trim()),
        name: key,
      });
    }
  }

  // Build the XML from the JSON object
  const builder = new XMLBuilder({ format: true, ignoreAttributes: false, indentBy: '    ' });
  
  let xmlString = builder.build(packageJson) as string;

  // Remove <version>0.0</version> (with any surrounding spaces or newlines)
  xmlString = xmlString.replace(/\s*<version>0\.0<\/version>\s*/g, '');

  // Ensure the closing </Package> is properly placed on its own line
  xmlString = xmlString.replace(/(\s*)<\/Package>/, '\n</Package>');

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  return xmlHeader + xmlString;
}
