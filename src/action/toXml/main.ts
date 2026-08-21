'use strict';

import { readFile } from 'node:fs/promises';

import * as core from '@actions/core';

import { listToPackageXml } from '../../core/listToPackageXml.js';
import { parseManifestXml } from '../../core/parseManifest.js';

export async function run(): Promise<void> {
  try {
    const listPath = core.getInput('package-list') || undefined;
    const xmlPath = core.getInput('package-xml') || 'package.xml';
    const noApiVersion = core.getBooleanInput('no-api-version');
    const failOnEmpty = core.getBooleanInput('fail-on-empty');

    const result = await listToPackageXml({ listPath, xmlPath, noApiVersion });

    const xml = await readFile(result.xmlPath, 'utf-8');
    const manifest = parseManifestXml(xml);
    const types = manifest.types.length;
    const members = manifest.types.reduce((total, type) => total + type.members.length, 0);

    core.setOutput('package-xml-path', result.xmlPath);
    core.setOutput('types', types);
    core.setOutput('members', members);
    core.setOutput('api-version', manifest.version ?? '');
    core.setOutput('warnings', result.warnings.join('\n'));

    result.warnings.forEach((warning) => core.warning(warning));
    core.info(`Package XML written to: ${result.xmlPath}`);

    if (failOnEmpty && types === 0) {
      core.setFailed('The package.xml has no <types> -- the provided list was invalid, empty, or not provided.');
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}
