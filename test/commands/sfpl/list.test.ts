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
  const list2 = resolve('test/samples/list2.txt');
  const outputXml = resolve('package.xml');
  const invalidPackage1 = resolve('test/samples/invalid1.xml');

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
    const actualOutput = await readFile(outputXml, 'utf-8')
    expect(output.trim()).to.equal('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package1} and ${outputXml}`);

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
    const actualOutput = await readFile(outputXml, 'utf-8')
    expect(output.trim()).to.equal('The package XML has been written to package.xml');
    strictEqual(actualOutput, expectedOutput, `Mismatch between ${package2} and ${outputXml}`);
  });
  it('test the invalid packages.', async () => {
    await SfplList.run(['-x', invalidPackage1]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('');
  });
});
