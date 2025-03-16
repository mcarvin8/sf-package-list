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
      exists: true,
      required: true
    }),
    'package-list': Flags.file({
      summary: messages.getMessage('flags.package-list.summary'),
      char: 'l',
      exists: false,
      default: 'package.txt'
    }),
  };

  public async run(): Promise<SfPackageListResult> {
    const { flags } = await this.parse(SfplList);

    const packageXml = flags['package-xml'];
    const packageList = flags['package-list'];

    const listResult = await packageXmlToList(packageXml);
    this.log(listResult);
    await writeFile(packageList, listResult);
    return { list: listResult };
  }
}
