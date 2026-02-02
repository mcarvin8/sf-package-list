import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { strictEqual } from 'node:assert';
import { describe, it, expect } from '@jest/globals';

import { listToPackageXml } from '../../../src/core/listToPackageXml.js';
import { packageXmlToList } from '../../../src/core/packageXmlToList.js';

describe('sfpc combine', () => {
  const package1 = resolve('test/samples/package-basic.xml');
  const list1 = resolve('test/samples/list-basic.txt');
  const package2 = resolve('test/samples/package-with-api-version.xml');
  const package2NoApi = resolve('test/samples/package-no-api-version.xml');
  const list2 = resolve('test/samples/list-with-api-version.txt');
  const package3 = resolve('test/samples/package-multiple-types.xml');
  const list3 = resolve('test/samples/list-multiple-types.txt');
  const outputXml = resolve('package.xml');
  const invalidPackage = resolve('test/samples/invalid-package.xml');
  const invalidList = resolve('test/samples/invalid-list.txt');

  it('convert the package 1 into list format.', async () => {
    const { packageList, warnings } = await packageXmlToList({
      xmlPath: package1,
      listPath: 'package.txt',
      noApiVersion: false,
    });
    expect(packageList.trim()).toEqual('CustomObject: ABC');
    expect(warnings).toEqual([]);
  });

  it('convert the list 1 back into a XML.', async () => {
    const { warnings, xmlPath } = await listToPackageXml({ listPath: list1, xmlPath: outputXml, noApiVersion: false });
    const expectedOutput = await readFile(package1, 'utf-8');
    const actualOutput = await readFile(xmlPath, 'utf-8');
    expect(warnings).toEqual([]);
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package1} and ${outputXml}`);
  });

  it('convert the package 2 into list format, excluding API version.', async () => {
    const { packageList, warnings } = await packageXmlToList({
      xmlPath: package2,
      listPath: 'package.txt',
      noApiVersion: true,
    });
    expect(packageList.trim()).toEqual('StandardValueSet: Glengarry_Leadz');
    expect(warnings).toEqual([]);
  });

  it('convert the package 2 into list format, including API version.', async () => {
    const { packageList, warnings } = await packageXmlToList({
      xmlPath: package2,
      listPath: 'package.txt',
      noApiVersion: false,
    });
    expect(packageList.trim()).toEqual('StandardValueSet: Glengarry_Leadz\nVersion: 59.0');
    expect(warnings).toEqual([]);
  });

  it('convert the list 2 back into a XML.', async () => {
    const { warnings, xmlPath } = await listToPackageXml({ listPath: list2, xmlPath: outputXml, noApiVersion: false });
    const expectedOutput = await readFile(package2, 'utf-8');
    const actualOutput = await readFile(xmlPath, 'utf-8');
    expect(warnings).toEqual([]);
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package2} and ${outputXml}`);
  });

  it('convert the list 2 back into a XML, excluding the API version.', async () => {
    const { warnings, xmlPath } = await listToPackageXml({ listPath: list2, xmlPath: outputXml, noApiVersion: true });
    const expectedOutput = await readFile(package2NoApi, 'utf-8');
    const actualOutput = await readFile(xmlPath, 'utf-8');
    expect(warnings).toEqual([]);
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package2} and ${outputXml}`);
  });

  it('convert the package 3 into list format, including API version.', async () => {
    const { packageList, warnings } = await packageXmlToList({
      xmlPath: package3,
      listPath: 'package.txt',
      noApiVersion: false,
    });
    const expectedOutput =
      'CustomLabel: Always_Be_Closing, Attention_Interest_Decision_Action, Leads_Are_Gold\nCustomObject: ABC, Glengarry, Mitch_And_Murray\nCustomField: Glengarry.Weak_Leadz__c, Coffee.is_Closer__c\nEmailTemplate: unfiled$public/Second_Prize_Set_of_Steak_Knives\nStandardValueSet: Glengarry_Leads, Cadillac_Eldorado\nLayout: Connector__c-Connector Layout V4\nVersion: 59.0';
    expect(packageList.trim()).toEqual(expectedOutput);
    expect(warnings).toEqual([]);
  });

  it('convert the list 3 back into a XML.', async () => {
    const { warnings, xmlPath } = await listToPackageXml({ listPath: list3, xmlPath: outputXml, noApiVersion: false });
    const expectedOutput = await readFile(package3, 'utf-8');
    const actualOutput = await readFile(xmlPath, 'utf-8');
    expect(warnings).toEqual([]);
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package3} and ${outputXml}`);
  });

  it('confirm the invalid package provides a warning.', async () => {
    const { warnings } = await packageXmlToList({
      xmlPath: invalidPackage,
      listPath: 'package.txt',
      noApiVersion: false,
    });
    expect(warnings).toContain('The provided package is invalid or has no components. Creating empty list file.');
  });

  it('confirm the invalid list provides a warning.', async () => {
    const { warnings } = await listToPackageXml({ listPath: invalidList, xmlPath: outputXml, noApiVersion: false });
    expect(warnings).toContain(
      'Line does not match expected package list format and will be skipped: ApexClass PrepareMySandbox'
    );
  });

  it('should warn and use empty package.xml if list file does not exist', async () => {
    const badPath = resolve('test/samples/does_not_exist.txt');
    const { warnings, xmlPath } = await listToPackageXml({
      listPath: badPath,
      xmlPath: outputXml,
      noApiVersion: false,
    });
    expect(warnings).toContain(`List file "${badPath}" could not be read. Using empty package.xml.`);
    const actualOutput = await readFile(xmlPath, 'utf-8');
    expect(actualOutput).toContain('<Package');
    expect(actualOutput).not.toContain('<types>');
  });

  it('should warn and use empty package.xml when no listPath is provided', async () => {
    const { warnings, xmlPath } = await listToPackageXml({
      listPath: undefined,
      xmlPath: outputXml,
      noApiVersion: false,
    });
    expect(warnings).toContain('No list file provided. Using empty package.xml.');
    const actualOutput = await readFile(xmlPath, 'utf-8');
    expect(actualOutput).toContain('<Package');
    expect(actualOutput).not.toContain('<types>');
  });
  it('should skip empty or whitespace-only lines in list file', async () => {
    const listPath = resolve('test/samples/list-whitespace-only.txt');
    const xmlPath = outputXml;

    // Create a test file with whitespace lines
    const content = `
    
    \t  
CustomObject: ABC

  `;
    await writeFile(listPath, content);

    const { warnings, xmlPath: outPath } = await listToPackageXml({
      listPath,
      xmlPath,
      noApiVersion: false,
    });

    // Should parse just the one CustomObject line and skip the rest silently
    expect(warnings).toEqual([]);
    const actualOutput = await readFile(outPath, 'utf-8');
    expect(actualOutput).toContain('<name>CustomObject</name>');
    expect(actualOutput).toContain('<members>ABC</members>');
  });
  it('should warn and write empty list when no xmlPath is provided', async () => {
    const listPath = resolve('test/samples/output-no-xmlpath.txt');

    const { packageList, warnings } = await packageXmlToList({
      xmlPath: undefined,
      listPath,
      noApiVersion: false,
    });

    expect(warnings).toContain('No package.xml file path was provided. Creating empty list file.');
    expect(packageList).toBe('');
    const fileContent = await readFile(listPath, 'utf-8');
    expect(fileContent).toBe('');
  });
  it('should warn and write empty list when xmlPath is invalid', async () => {
    const xmlPath = resolve('test/samples/does_not_exist.xml');
    const listPath = resolve('test/samples/output-invalid-package.txt');

    const { packageList, warnings } = await packageXmlToList({
      xmlPath,
      listPath,
      noApiVersion: false,
    });

    expect(warnings).toContain('The provided package is invalid or could not be read. Creating empty list file.');
    expect(packageList).toBe('');
    const fileContent = await readFile(listPath, 'utf-8');
    expect(fileContent).toBe('');
  });
});
