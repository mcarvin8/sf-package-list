'use strict';

import { readFile, writeFile } from 'node:fs/promises';

import * as core from '@actions/core';

import { convertXmlToList, packageXmlToList } from '../core/packageXmlToList.js';
import { parseManifestXml } from '../core/parseManifest.js';

function countTypesAndMembers(xml: string): { types: number; members: number } {
  try {
    const manifest = parseManifestXml(xml);
    return {
      types: manifest.types.length,
      members: manifest.types.reduce((total, type) => total + type.members.length, 0),
    };
  } catch {
    return { types: 0, members: 0 };
  }
}

async function countFromFile(xmlPath: string | undefined): Promise<{ types: number; members: number }> {
  if (!xmlPath) return { types: 0, members: 0 };
  try {
    return countTypesAndMembers(await readFile(xmlPath, 'utf-8'));
  } catch {
    return { types: 0, members: 0 };
  }
}

export async function runToList(): Promise<void> {
  try {
    const xmlContent = core.getInput('package-xml-content');
    const xmlPath = core.getInput('package-xml') || undefined;
    const listPath = core.getInput('package-list') || 'package.txt';
    const noApiVersion = core.getBooleanInput('no-api-version');
    const failOnEmpty = core.getBooleanInput('fail-on-empty');

    if (xmlContent && xmlPath) {
      core.setFailed('Provide either package-xml or package-xml-content as the source package.xml, not both.');
      return;
    }

    let packageList: string;
    let warnings: string[];
    let counts: { types: number; members: number };
    if (xmlContent) {
      ({ packageList, warnings } = convertXmlToList(xmlContent, { noApiVersion }));
      await writeFile(listPath, packageList);
      counts = countTypesAndMembers(xmlContent);
    } else {
      ({ packageList, warnings } = await packageXmlToList({ xmlPath, listPath, noApiVersion }));
      counts = await countFromFile(xmlPath);
    }

    core.setOutput('package-list-path', listPath);
    core.setOutput('package-list', packageList);
    core.setOutput('types', counts.types);
    core.setOutput('members', counts.members);
    core.setOutput('warnings', warnings.join('\n'));

    warnings.forEach((warning) => core.warning(warning));
    core.info(`Package list written to: ${listPath}`);

    if (failOnEmpty && counts.types === 0) {
      core.setFailed('The package list has no types -- the provided package.xml was invalid, empty, or not provided.');
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}
