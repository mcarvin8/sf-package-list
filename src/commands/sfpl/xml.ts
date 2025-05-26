import { writeFile } from 'node:fs/promises';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

import { listToPackageXml } from '../../core/listToPackageXml.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-package-list', 'sfpl.xml');

export type SfPackageXmlResult = {
  path: string;
};

export default class SfplXml extends SfCommand<SfPackageXmlResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'package-xml': Flags.file({
      summary: messages.getMessage('flags.package-xml.summary'),
      char: 'x',
      exists: false,
      default: 'package.xml',
    }),
    'package-list': Flags.file({
      summary: messages.getMessage('flags.package-list.summary'),
      char: 'l',
      exists: false,
      required: false,
    }),
    'no-api-version': Flags.boolean({
      summary: messages.getMessage('flags.no-api-version.summary'),
      char: 'n',
      required: false,
      default: false,
    }),
  };

  public async run(): Promise<SfPackageXmlResult> {
    const { flags } = await this.parse(SfplXml);
    let warnings: string[] = [];

    const packageXml = flags['package-xml'];
    const packageList = flags['package-list'];
    const noApiVersion = flags['no-api-version'];

    const xmlResult = await listToPackageXml(packageList, noApiVersion);
    await writeFile(packageXml, xmlResult.xmlString);
    warnings = xmlResult.warnings;
    // Print warnings if any
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        this.warn(warning);
      });
    }
    this.log(`The package XML has been written to ${packageXml}`);
    return { path: packageXml };
  }
}
