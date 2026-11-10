'use strict';

import { readFile, writeFile } from 'node:fs/promises';

import * as core from '@actions/core';

import { convertListToXml, listToPackageXml } from '../core/listToPackageXml.js';
import { parseManifestXml } from '../core/parseManifest.js';

export async function runToXml(): Promise<void> {
  try {
    const listContent = core.getInput('package-list-content');
    const listPath = core.getInput('package-list') || undefined;
    const xmlPath = core.getInput('package-xml') || 'package.xml';
    const noApiVersion = core.getBooleanInput('no-api-version');
    const failOnEmpty = core.getBooleanInput('fail-on-empty');

    if (listContent && listPath) {
      core.setFailed('Provide either package-list or package-list-content as the source list, not both.');
      return;
    }

    let packageXml: string;
    let warnings: string[];
    if (listContent) {
      ({ packageXml, warnings } = convertListToXml(listContent, { noApiVersion }));
      await writeFile(xmlPath, packageXml);
    } else {
      ({ warnings } = await listToPackageXml({ listPath, xmlPath, noApiVersion }));
      packageXml = await readFile(xmlPath, 'utf-8');
    }

    const manifest = parseManifestXml(packageXml);
    const types = manifest.types.length;
    const members = manifest.types.reduce((total, type) => total + type.members.length, 0);

    core.setOutput('package-xml-path', xmlPath);
    core.setOutput('package-xml', packageXml);
    core.setOutput('types', types);
    core.setOutput('members', members);
    core.setOutput('api-version', manifest.version ?? '');
    core.setOutput('warnings', warnings.join('\n'));

    warnings.forEach((warning) => core.warning(warning));
    core.info(`Package XML written to: ${xmlPath}`);

    if (failOnEmpty && types === 0) {
      core.setFailed('The package.xml has no <types> -- the provided list was invalid, empty, or not provided.');
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}
