import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';

import { packageXmlToList } from '../../core/packageXmlToList.js';
import { SfPackageListResult } from '../../core/types.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-package-list', 'sfpl.list');

export default class SfplList extends SfCommand<SfPackageListResult> {
  public static override readonly summary = messages.getMessage('summary');
  public static override readonly description = messages.getMessage('description');
  public static override readonly examples = messages.getMessages('examples');

  public static override readonly flags = {
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
    'fail-on-empty': Flags.boolean({
      summary: messages.getMessage('flags.fail-on-empty.summary'),
      default: false,
    }),
  };

  public async run(): Promise<SfPackageListResult> {
    const { flags } = await this.parse(SfplList);

    const result = await packageXmlToList({
      xmlPath: flags['package-xml'],
      listPath: flags['package-list'],
      noApiVersion: flags['no-api-version'],
    });

    result.warnings.forEach((w) => this.warn(w));
    this.log(result.packageList);

    if (flags['fail-on-empty'] && result.packageList === '') {
      throw new SfError('The package list is empty -- the provided package.xml was invalid, missing, or empty.');
    }

    return { list: result.packageList };
  }
}
