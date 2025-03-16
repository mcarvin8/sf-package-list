import { writeFile } from 'node:fs/promises';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

import { listToPackageXml } from '../../helpers/listToPackageXml.js';

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
      default: 'package.xml'
    }),
    'package-list': Flags.file({
      summary: messages.getMessage('flags.package-list.summary'),
      char: 'l',
      exists: true,
      required: true
    }),
  };

  public async run(): Promise<SfPackageXmlResult> {
    const { flags } = await this.parse(SfplXml);

    const packageXml = flags['package-xml'];
    const packageList = flags['package-list'];

    const xmlResult = await listToPackageXml(packageList);
    await writeFile(packageXml, xmlResult);
    this.log(`The package XML has been written to ${packageXml}`);
    return { path: packageXml };
  }
}
