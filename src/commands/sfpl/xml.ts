import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

import { listToPackageXml } from '../../core/listToPackageXml.js';
import { SfPackageXmlResult } from '../../core/types.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-package-list', 'sfpl.xml');

export default class SfplXml extends SfCommand<SfPackageXmlResult> {
  public static override readonly summary = messages.getMessage('summary');
  public static override readonly description = messages.getMessage('description');
  public static override readonly examples = messages.getMessages('examples');

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

    const result = await listToPackageXml({
      listPath: flags['package-list'],
      xmlPath: flags['package-xml'],
      noApiVersion: flags['no-api-version'],
    });

    result.warnings.forEach((w) => this.warn(w));
    this.log(`The package XML has been written to ${result.xmlPath}`);
    return { path: result.xmlPath };
  }
}
