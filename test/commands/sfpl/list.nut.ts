import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { strictEqual } from 'node:assert';
import { describe, it, expect } from '@jest/globals';

import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';

describe('sfpc combine NUTs', () => {
  let session: TestSession;
  const package1 = resolve('samples/package1.xml');
  const list1 = resolve('samples/list1.txt');
  const package2 = resolve('samples/package2.xml');
  const package2NoApi = resolve('samples/package2_no_version.xml');
  const list2 = resolve('samples/list2.txt');
  const package3 = resolve('samples/package3.xml');
  const list3 = resolve('samples/list3.txt');
  const outputXml = resolve('package.xml');

  beforeAll(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  afterAll(async () => {
    await session?.clean();
  });

  it('convert the package 1 into list format.', () => {
    const command = `sfpl list -x ${package1}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput = 'CustomObject: ABC';
    expect(output.trim()).toEqual(expectedOutput);
  });
  it('convert the list 1 back into a XML.', async () => {
    const command = `sfpl xml -l ${list1}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput = await readFile(package1, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).toEqual('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package1} and ${outputXml}`);
  });
  it('convert the package 2 into list format, excluding the API version.', () => {
    const command = `sfpl list -x ${package2} -n`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput = 'StandardValueSet: Glengarry_Leadz';
    expect(output.trim()).toEqual(expectedOutput);
  });
  it('convert the package 2 into list format.', () => {
    const command = `sfpl list -x ${package2}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput = 'StandardValueSet: Glengarry_Leadz\nVersion: 59.0';
    expect(output.trim()).toEqual(expectedOutput);
  });
  it('convert the list 2 back into a XML.', async () => {
    const command = `sfpl xml -l ${list2}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput = await readFile(package2, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).toEqual('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package2} and ${outputXml}`);
  });
  it('convert the list 2 back into a XML, excluding the API version.', async () => {
    const command = `sfpl xml -l ${list2} -n`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput = await readFile(package2NoApi, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).toEqual('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package2NoApi} and ${outputXml}`);
  });
  it('convert the package 3 into list format.', () => {
    const command = `sfpl list -x ${package3}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput =
      'CustomLabel: Always_Be_Closing, Attention_Interest_Decision_Action, Leads_Are_Gold\nCustomObject: ABC, Glengarry, Mitch_And_Murray\nCustomField: Glengarry.Weak_Leadz__c, Coffee.is_Closer__c\nEmailTemplate: unfiled$public/Second_Prize_Set_of_Steak_Knives\nStandardValueSet: Glengarry_Leads, Cadillac_Eldorado\nLayout: Connector__c-Connector Layout V4\nVersion: 59.0';
    expect(output.trim()).toEqual(expectedOutput);
  });
  it('convert the list 3 back into a XML.', async () => {
    const command = `sfpl xml -l ${list3}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    const expectedOutput = await readFile(package3, 'utf-8');
    const actualOutput = await readFile(outputXml, 'utf-8');
    expect(output.trim()).toEqual('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package3} and ${outputXml}`);
  });
});
