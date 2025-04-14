import { writeFile } from 'node:fs/promises';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

import { packageXmlToList } from '../../helpers/packageXmlToList.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-package-list', 'sfpl.list');

export type SfPackageListResult = {
  list: string;
};

export default class SfplList extends SfCommand<SfPackageListResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'package-xml': Flags.file({
      summary: messages.getMessage('flags.package-xml.summary'),
      char: 'x',
      exists: false,
      required: false,
    }),
    'package-list': Flags.file({
      summary: messages.getMessage('flags.package-list.summary'),
      char: 'l',
      exists: false,
      default: 'package.txt',
    }),
    'no-api-version': Flags.boolean({
      summary: messages.getMessage('flags.no-api-version.summary'),
      char: 'n',
      required: false,
      default: false,
    }),
  };

  public async run(): Promise<SfPackageListResult> {
    const { flags } = await this.parse(SfplList);
    let warnings: string[] = [];

    const packageXml = flags['package-xml'];
    const packageList = flags['package-list'];
    const noApiVersion = flags['no-api-version'];

    const listResult = await packageXmlToList(packageXml, noApiVersion);
    warnings = listResult.warnings;
    // Print warnings if any
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        this.warn(warning);
      });
    }
    this.log(listResult.packageList);
    await writeFile(packageList, listResult.packageList);
    return { list: listResult.packageList };
  }
}
