import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { strictEqual } from 'node:assert';

import { TestContext } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import SfplList from '../../../src/commands/sfpl/list.js';
import SfplXml from '../../../src/commands/sfpl/xml.js';

describe('sfpc combine', () => {
  const $$ = new TestContext();
  let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;
  const package1 = resolve('test/samples/package1.xml');
  const list1 = resolve('test/samples/list1.txt');
  const package2 = resolve('test/samples/package2.xml');
  const package2NoApi = resolve('test/samples/package2_no_version.xml');
  const list2 = resolve('test/samples/list2.txt');
  const package3 = resolve('test/samples/package3.xml');
  const list3 = resolve('test/samples/list3.txt');
  const outputXml = resolve('package.xml');
  const invalidPackage = resolve('test/samples/invalid.xml');
  const invalidList = resolve('test/samples/invalid.txt');

  beforeEach(() => {
    sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('convert the package 1 into list format.', async () => {
    await SfplList.run(['-x', package1]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput = 'CustomObject: ABC';
    expect(output.trim()).to.equal(expectedOutput);
  });
  it('convert the list 1 back into a XML.', async () => {
    await SfplXml.run(['-l', list1]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput = await readFile(package1, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).to.equal('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package1} and ${outputXml}`);
  });
  it('convert the package 2 into list format, excluding the API version.', async () => {
    await SfplList.run(['-x', package2, '-n']);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput = 'StandardValueSet: Glengarry_Leadz';
    expect(output.trim()).to.equal(expectedOutput);
  });
  it('convert the package 2 into list format.', async () => {
    await SfplList.run(['-x', package2]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput = 'StandardValueSet: Glengarry_Leadz\nVersion: 59.0';
    expect(output.trim()).to.equal(expectedOutput);
  });
  it('convert the list 2 back into a XML.', async () => {
    await SfplXml.run(['-l', list2]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput = await readFile(package2, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).to.equal('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package2} and ${outputXml}`);
  });
  it('convert the list 2 back into a XML, excluding the API version.', async () => {
    await SfplXml.run(['-l', list2, '-n']);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput = await readFile(package2NoApi, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).to.equal('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package2NoApi} and ${outputXml}`);
  });
  it('convert the package 3 into list format.', async () => {
    await SfplList.run(['-x', package3]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput =
      'CustomLabel: Always_Be_Closing, Attention_Interest_Decision_Action, Leads_Are_Gold\nCustomObject: ABC, Glengarry, Mitch_And_Murray\nCustomField: Glengarry.Weak_Leadz__c, Coffee.is_Closer__c\nEmailTemplate: unfiled$public/Second_Prize_Set_of_Steak_Knives\nStandardValueSet: Glengarry_Leads, Cadillac_Eldorado\nVersion: 59.0';
    expect(output.trim()).to.equal(expectedOutput);
  });
  it('convert the list 3 back into a XML.', async () => {
    await SfplXml.run(['-l', list3]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    const expectedOutput = await readFile(package3, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).to.equal('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package3} and ${outputXml}`);
  });
  it('confirm the invalid package provides a warning.', async () => {
    await SfplList.run(['-x', invalidPackage]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('');
    const warnings = sfCommandStubs.warn
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(warnings).to.include('The provided package is invalid or has no components. Creating empty list file.');
  });
  it('confirm the invalid list provides a warning.', async () => {
    await SfplXml.run(['-l', invalidList]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('');
    const warnings = sfCommandStubs.warn
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(warnings).to.include(
      'Line does not match expected package list format and will be skipped: ApexClass PrepareMySandbox'
    );
  });
});
