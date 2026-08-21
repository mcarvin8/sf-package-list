'use strict';

import { readFile } from 'node:fs/promises';

import * as core from '@actions/core';

import { packageXmlToList } from '../../core/packageXmlToList.js';
import { parseManifestXml } from '../../core/parseManifest.js';

async function countTypesAndMembers(xmlPath: string): Promise<{ types: number; members: number }> {
  try {
    const xml = await readFile(xmlPath, 'utf-8');
    const manifest = parseManifestXml(xml);
    return {
      types: manifest.types.length,
      members: manifest.types.reduce((total, type) => total + type.members.length, 0),
    };
  } catch {
    return { types: 0, members: 0 };
  }
}

export async function run(): Promise<void> {
  try {
    const xmlPath = core.getInput('package-xml') || undefined;
    const listPath = core.getInput('package-list') || 'package.txt';
    const noApiVersion = core.getBooleanInput('no-api-version');
    const failOnEmpty = core.getBooleanInput('fail-on-empty');

    const result = await packageXmlToList({ xmlPath, listPath, noApiVersion });
    const { types, members } = xmlPath ? await countTypesAndMembers(xmlPath) : { types: 0, members: 0 };

    core.setOutput('package-list-path', listPath);
    core.setOutput('types', types);
    core.setOutput('members', members);
    core.setOutput('warnings', result.warnings.join('\n'));

    result.warnings.forEach((warning) => core.warning(warning));
    core.info(`Package list written to: ${listPath}`);

    if (failOnEmpty && types === 0) {
      core.setFailed('The package list has no types -- the provided package.xml was invalid, empty, or not provided.');
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}
