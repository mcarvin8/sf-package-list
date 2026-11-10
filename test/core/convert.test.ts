import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { convertListToXml } from '../../src/core/listToPackageXml.js';
import { convertXmlToList } from '../../src/core/packageXmlToList.js';

const samples = join(import.meta.dirname, '..', 'samples');
const sample = async (name: string) => (await readFile(join(samples, name), 'utf-8')).replace(/\r\n/g, '\n');

const EMPTY_XML =
  '<?xml version="1.0" encoding="UTF-8"?>\n<Package xmlns="http://soap.sforce.com/2006/04/metadata"></Package>\n';

describe('convertListToXml', () => {
  it('converts a list to package.xml text matching the fixture', async () => {
    const result = convertListToXml(await sample('list-with-api-version.txt'));
    expect(result.packageXml.trimEnd()).toBe((await sample('package-with-api-version.xml')).trimEnd());
    expect(result.types).toBe(1);
    expect(result.warnings).toEqual([]);
  });

  it('omits the version when noApiVersion is set', async () => {
    const { packageXml } = convertListToXml(await sample('list-with-api-version.txt'), { noApiVersion: true });
    expect(packageXml).not.toContain('<version>');
    expect(packageXml).toContain('<members>Glengarry_Leadz</members>');
  });

  it('keeps the version by default', () => {
    expect(convertListToXml('ApexClass: A\nVersion: 62.0').packageXml).toContain('<version>62.0</version>');
  });

  it('returns an empty package.xml for an empty list, without warnings', () => {
    expect(convertListToXml('')).toEqual({ packageXml: EMPTY_XML, warnings: [], types: 0 });
  });

  it('accepts CRLF line endings', () => {
    const result = convertListToXml('ApexClass: A, B\r\nCustomObject: Account\r\n');
    expect(result.types).toBe(2);
    expect(result.warnings).toEqual([]);
    expect(result.packageXml).toContain('<members>B</members>');
  });

  it('skips malformed lines and reports them as warnings', () => {
    const result = convertListToXml('ApexClass PrepareMySandbox\nCustomObject:\nApexClass: A');
    expect(result.types).toBe(1);
    expect(result.warnings).toEqual([
      'Line does not match expected package list format and will be skipped: ApexClass PrepareMySandbox',
      'Line has no members and will be skipped: CustomObject:',
    ]);
  });
});

describe('convertXmlToList', () => {
  it('converts package.xml text to a list matching the fixture', async () => {
    const result = convertXmlToList(await sample('package-with-api-version.xml'));
    expect(result).toEqual({ packageList: (await sample('list-with-api-version.txt')).trimEnd(), warnings: [] });
  });

  it('omits the version when noApiVersion is set', async () => {
    const result = convertXmlToList(await sample('package-with-api-version.xml'), { noApiVersion: true });
    expect(result).toEqual({ packageList: 'StandardValueSet: Glengarry_Leadz', warnings: [] });
  });

  it('returns an empty list with a warning for a package with no types', async () => {
    expect(convertXmlToList(await sample('package-no-types.xml'))).toEqual({
      packageList: '',
      warnings: ['The provided package has no components. Returning an empty list.'],
    });
  });

  it('returns an empty list with a warning for invalid XML, without throwing', () => {
    const result = convertXmlToList('<NotAPackage/>');
    expect(result.packageList).toBe('');
    expect(result.warnings).toEqual([
      'The provided package is invalid. Returning an empty list. manifest must have a single <Package> root element',
    ]);
  });

  it('round-trips with convertListToXml', async () => {
    const list = (await sample('list-multiple-types.txt')).trimEnd();
    const { packageXml } = convertListToXml(list);
    const { packageList } = convertXmlToList(packageXml);
    expect(packageList).toBe(convertXmlToList(convertListToXml(packageList).packageXml).packageList);
    expect(packageList).toContain('StandardValueSet: Glengarry_Leads, Cadillac_Eldorado');
    expect(packageList.endsWith('Version: 59.0')).toBe(true);
  });
});
