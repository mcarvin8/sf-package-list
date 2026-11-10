// Runtime check of the public programmatic API, run as an external consumer.
//
// Copied into a scratch project that installs sf-package-list (from an
// `npm pack` tarball or the npm registry), so the import below resolves through
// the package's `exports` map exactly like it would for a real user.
//
// Usage: node check.mjs <samplesDir> <outDir>
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import * as api from 'sf-package-list';
import {
  convertListToXml,
  convertXmlToList,
  listToPackageXml,
  packageXmlToList,
  parseManifestXml,
} from 'sf-package-list';

const [samplesDir, outDir] = process.argv.slice(2);
assert.ok(samplesDir && outDir, 'usage: check.mjs <samplesDir> <outDir>');

const sample = (name) => join(samplesDir, name);
const out = (name) => join(outDir, name);
const read = async (path) => (await readFile(path, 'utf-8')).replace(/\r\n/g, '\n').trimEnd();

let passed = 0;
async function check(name, fn) {
  await fn();
  passed++;
  console.log(`ok - ${name}`);
}

await check('exports', () => {
  assert.deepEqual(Object.keys(api).sort(), [
    'convertListToXml',
    'convertXmlToList',
    'listToPackageXml',
    'packageXmlToList',
    'parseManifestXml',
  ]);
  for (const fn of [convertListToXml, convertXmlToList, listToPackageXml, packageXmlToList, parseManifestXml]) {
    assert.equal(typeof fn, 'function');
  }
});

await check('string API converts in memory and matches the fixtures', async () => {
  const list = await read(sample('list-with-api-version.txt'));
  const xml = await read(sample('package-with-api-version.xml'));

  const toXml = convertListToXml(list);
  assert.equal(toXml.packageXml.trimEnd(), xml);
  assert.equal(toXml.types, 1);
  assert.deepEqual(toXml.warnings, []);

  assert.deepEqual(convertXmlToList(xml), { packageList: list, warnings: [] });
  assert.equal(convertXmlToList(xml, { noApiVersion: true }).packageList, 'StandardValueSet: Glengarry_Leadz');
});

await check('string API warns instead of throwing', () => {
  const badList = convertListToXml('ApexClass PrepareMySandbox');
  assert.equal(badList.types, 0);
  assert.equal(badList.warnings.length, 1);

  const badXml = convertXmlToList('<NotAPackage/>');
  assert.equal(badXml.packageList, '');
  assert.equal(badXml.warnings.length, 1);
});

await check('list -> package.xml matches the fixture', async () => {
  const xmlPath = out('to-xml.xml');
  const result = await listToPackageXml({
    listPath: sample('list-with-api-version.txt'),
    xmlPath,
    noApiVersion: false,
  });
  assert.deepEqual(result, { xmlPath, warnings: [], types: 1 });
  assert.equal(await read(xmlPath), await read(sample('package-with-api-version.xml')));
});

await check('package.xml -> list matches the fixture', async () => {
  const listPath = out('to-list.txt');
  const result = await packageXmlToList({
    xmlPath: sample('package-with-api-version.xml'),
    listPath,
    noApiVersion: false,
  });
  assert.deepEqual(result.warnings, []);
  assert.equal(result.packageList, await read(sample('list-with-api-version.txt')));
  assert.equal(await read(listPath), result.packageList);
});

await check('multi-type list survives a round trip', async () => {
  const xmlPath = out('round-trip.xml');
  const listPath = out('round-trip.txt');
  const toXml = await listToPackageXml({ listPath: sample('list-multiple-types.txt'), xmlPath, noApiVersion: false });
  assert.equal(toXml.types, 6);
  const { packageList } = await packageXmlToList({ xmlPath, listPath, noApiVersion: false });
  assert.ok(packageList.startsWith('CustomLabel: Always_Be_Closing, Attention_Interest_Decision_Action'));
  assert.ok(packageList.includes('StandardValueSet: Glengarry_Leads, Cadillac_Eldorado'));
  assert.ok(packageList.endsWith('Version: 59.0'));
});

await check('noApiVersion omits the version both ways', async () => {
  const xmlPath = out('no-version.xml');
  await listToPackageXml({ listPath: sample('list-with-api-version.txt'), xmlPath, noApiVersion: true });
  assert.ok(!(await read(xmlPath)).includes('<version>'));

  const { packageList } = await packageXmlToList({
    xmlPath: sample('package-with-api-version.xml'),
    listPath: out('no-version.txt'),
    noApiVersion: true,
  });
  assert.equal(packageList, 'StandardValueSet: Glengarry_Leadz');
});

await check('parseManifestXml parses a string in memory', async () => {
  const parsed = parseManifestXml(await readFile(sample('package-with-api-version.xml'), 'utf-8'));
  assert.deepEqual(parsed, {
    types: [{ name: 'StandardValueSet', members: ['Glengarry_Leadz'] }],
    version: '59.0',
  });
});

await check('bad input warns instead of throwing', async () => {
  const badList = await listToPackageXml({
    listPath: sample('invalid-list.txt'),
    xmlPath: out('bad-list.xml'),
    noApiVersion: false,
  });
  assert.equal(badList.types, 0);
  assert.equal(badList.warnings.length, 1);

  const missingList = await listToPackageXml({
    listPath: sample('does-not-exist.txt'),
    xmlPath: out('missing-list.xml'),
    noApiVersion: false,
  });
  assert.equal(missingList.types, 0);
  assert.ok(missingList.warnings[0].includes('could not be read'));

  const noTypes = await packageXmlToList({
    xmlPath: sample('package-no-types.xml'),
    listPath: out('no-types.txt'),
    noApiVersion: false,
  });
  assert.equal(noTypes.packageList, '');
  assert.equal(noTypes.warnings.length, 1);
  assert.equal(await read(out('no-types.txt')), '');
});

await check('deep imports are blocked by the exports map', async () => {
  await assert.rejects(import('sf-package-list/lib/core/listToPackageXml.js'), {
    code: 'ERR_PACKAGE_PATH_NOT_EXPORTED',
  });
});

console.log(`\n${passed} checks passed`);
