// Compile-only check of the published type declarations, run as an external consumer
// with `tsc --noEmit` (see tsconfig.json next to this file). Never executed.
//
// Fails if the package stops shipping types, a public type is renamed or removed, or
// a signature changes in a way that breaks existing callers.
import {
  type ConvertListToXmlResult,
  type ConvertXmlToListResult,
  convertListToXml,
  convertXmlToList,
  listToPackageXml,
  type ParsedManifest,
  type ParsedManifestType,
  packageXmlToList,
  parseManifestXml,
} from 'sf-package-list';

async function consume(): Promise<void> {
  const toXml = await listToPackageXml({ listPath: 'package.txt', xmlPath: 'package.xml', noApiVersion: false });
  const xmlPath: string = toXml.xmlPath;
  const types: number = toXml.types;
  const xmlWarnings: string[] = toXml.warnings;

  // listPath is optional: omitting it writes an empty package.xml
  await listToPackageXml({ xmlPath: 'package.xml', noApiVersion: true });

  const toList = await packageXmlToList({ xmlPath: 'package.xml', listPath: 'package.txt', noApiVersion: false });
  const packageList: string = toList.packageList;
  const listWarnings: string[] = toList.warnings;

  // xmlPath is optional: omitting it writes an empty list
  await packageXmlToList({ listPath: 'package.txt', noApiVersion: true });

  const parsed: ParsedManifest = parseManifestXml('<Package/>');
  const first: ParsedManifestType = parsed.types[0];
  const name: string = first.name;
  const members: string[] = first.members;
  const version: string | null = parsed.version;

  const listToXml: ConvertListToXmlResult = convertListToXml('ApexClass: A', { noApiVersion: true });
  const packageXml: string = listToXml.packageXml;
  const listTypes: number = listToXml.types;
  const xmlToList: ConvertXmlToListResult = convertXmlToList(packageXml);
  const roundTripped: string = xmlToList.packageList;
  const xmlToListWarnings: string[] = xmlToList.warnings;
  // options are optional on the string API
  convertListToXml('ApexClass: A');
  convertXmlToList(packageXml, {});

  // @ts-expect-error -- the string API takes text, not a file options object
  convertListToXml({ listPath: 'package.txt' });

  // @ts-expect-error -- xmlPath is required
  await listToPackageXml({ listPath: 'package.txt', noApiVersion: false });

  // @ts-expect-error -- noApiVersion is required
  await packageXmlToList({ xmlPath: 'package.xml', listPath: 'package.txt' });

  // @ts-expect-error -- parseManifestXml takes a string, not an options object
  parseManifestXml({ xmlPath: 'package.xml' });

  void [xmlPath, types, xmlWarnings, packageList, listWarnings, name, members, version];
  void [listTypes, roundTripped, xmlToListWarnings];
}

void consume;
