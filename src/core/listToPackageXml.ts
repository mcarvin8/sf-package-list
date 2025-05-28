import { readFile, writeFile } from 'node:fs/promises';
import { PackageManifestObject } from '@salesforce/source-deploy-retrieve';
import { XMLBuilder } from 'fast-xml-parser';

function generateEmptyPackageXml(): string {
  const emptyPackage: PackageManifestObject = {
    Package: {
      '@_xmlns': 'http://soap.sforce.com/2006/04/metadata',
      types: [],
      version: '0.0',
    },
  };
  const builder = new XMLBuilder({ format: true, ignoreAttributes: false, indentBy: '    ' });
  let xmlString = builder.build(emptyPackage) as string;
  xmlString = xmlString.replace(/\s*<version>0\.0<\/version>\s*/g, '');
  xmlString = xmlString.replace(/(\s*)<\/Package>/, '\n</Package>');
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString;
}

function parseListLines(lines: string[], noApiVersion: boolean, warnings: string[]): PackageManifestObject {
  const packageJson: PackageManifestObject = {
    Package: {
      '@_xmlns': 'http://soap.sforce.com/2006/04/metadata',
      types: [],
      version: '0.0',
    },
  };

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

    packageJson.Package.types.push({
      members: values
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      name: key,
    });
  }

  return packageJson;
}

export async function listToPackageXml(
  listPath: string | undefined,
  xmlPath: string,
  noApiVersion: boolean
): Promise<string[]> {
  const warnings: string[] = [];
  let listString: string | undefined;
  let xmlString;

  if (listPath) {
    try {
      listString = await readFile(listPath, 'utf-8');
    } catch {
      warnings.push(`List file "${listPath}" could not be read. Using empty package.xml.`);
    }
  } else {
    warnings.push('No list file provided. Using empty package.xml.');
  }

  if (listString) {
    const lines = listString.split('\n');
    const packageJson = parseListLines(lines, noApiVersion, warnings);

    const builder = new XMLBuilder({ format: true, ignoreAttributes: false, indentBy: '    ' });
    xmlString = builder.build(packageJson) as string;

    xmlString = xmlString.replace(/\s*<version>0\.0<\/version>\s*/g, '');
    xmlString = xmlString.replace(/(\s*)<\/Package>/, '\n</Package>');
    // final string
    xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString;
  } else {
    xmlString = generateEmptyPackageXml();
  }

  await writeFile(xmlPath, xmlString);

  return warnings;
}
