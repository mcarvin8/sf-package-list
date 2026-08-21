import { readFile } from 'node:fs/promises';

import * as core from '@actions/core';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { run } from '../../../src/action/toList/main.js';
import { packageXmlToList } from '../../../src/core/packageXmlToList.js';
import { parseManifestXml } from '../../../src/core/parseManifest.js';

vi.mock('@actions/core');
vi.mock('node:fs/promises');
vi.mock('../../../src/core/packageXmlToList.js');
vi.mock('../../../src/core/parseManifest.js');

const packageXmlToListMock = packageXmlToList as unknown as Mock;
const parseManifestXmlMock = parseManifestXml as unknown as Mock;
const readFileMock = readFile as unknown as Mock;
const getInputMock = core.getInput as unknown as Mock;
const getBooleanInputMock = core.getBooleanInput as unknown as Mock;

function stubInputs(inputs: Record<string, string>, booleanInputs: Record<string, boolean> = {}): void {
  getInputMock.mockImplementation((name: string) => inputs[name] ?? '');
  getBooleanInputMock.mockImplementation((name: string) => booleanInputs[name] ?? false);
}

const baseManifest = { types: [{ name: 'ApexClass', members: ['A'] }], version: '60.0' };

describe('GitHub Action entrypoint (to-list)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readFileMock.mockResolvedValue('<Package></Package>');
    parseManifestXmlMock.mockReturnValue(baseManifest);
  });

  it('maps inputs to packageXmlToList, defaulting package-list to package.txt', async () => {
    stubInputs({ 'package-xml': 'package.xml' });
    packageXmlToListMock.mockResolvedValue({ packageList: 'ApexClass: A', warnings: [] });

    await run();

    expect(packageXmlToListMock).toHaveBeenCalledWith({
      xmlPath: 'package.xml',
      listPath: 'package.txt',
      noApiVersion: false,
    });
    expect(getBooleanInputMock).toHaveBeenCalledWith('no-api-version');
    expect(getBooleanInputMock).toHaveBeenCalledWith('fail-on-empty');
  });

  it('passes undefined xmlPath when package-xml is not provided', async () => {
    stubInputs({});
    packageXmlToListMock.mockResolvedValue({ packageList: '', warnings: [] });

    await run();

    expect(packageXmlToListMock).toHaveBeenCalledWith(
      expect.objectContaining({ xmlPath: undefined, listPath: 'package.txt' }),
    );
    expect(parseManifestXmlMock).not.toHaveBeenCalled();
  });

  it('sets outputs and logs the written path on success', async () => {
    stubInputs({ 'package-xml': 'package.xml', 'package-list': 'out.txt' });
    packageXmlToListMock.mockResolvedValue({ packageList: 'ApexClass: A', warnings: [] });

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('package-list-path', 'out.txt');
    expect(core.setOutput).toHaveBeenCalledWith('types', 1);
    expect(core.setOutput).toHaveBeenCalledWith('members', 1);
    expect(core.setOutput).toHaveBeenCalledWith('warnings', '');
    expect(core.info).toHaveBeenCalledWith('Package list written to: out.txt');
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('reports zero types and members when re-parsing the input package.xml fails', async () => {
    stubInputs({ 'package-xml': 'package.xml' });
    packageXmlToListMock.mockResolvedValue({ packageList: '', warnings: ['boom'] });
    parseManifestXmlMock.mockImplementation(() => {
      throw new Error('bad xml');
    });

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('types', 0);
    expect(core.setOutput).toHaveBeenCalledWith('members', 0);
  });

  it('propagates warnings from packageXmlToList to core.warning and the warnings output', async () => {
    stubInputs({ 'package-xml': 'package.xml' });
    packageXmlToListMock.mockResolvedValue({
      packageList: 'ApexClass: A',
      warnings: ['first warning', 'second warning'],
    });

    await run();

    expect(core.warning).toHaveBeenCalledWith('first warning');
    expect(core.warning).toHaveBeenCalledWith('second warning');
    expect(core.setOutput).toHaveBeenCalledWith('warnings', 'first warning\nsecond warning');
  });

  it('fails the action when fail-on-empty is true and there are no types', async () => {
    stubInputs({ 'package-xml': 'package.xml' }, { 'fail-on-empty': true });
    packageXmlToListMock.mockResolvedValue({ packageList: '', warnings: [] });
    parseManifestXmlMock.mockReturnValue({ types: [], version: null });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      'The package list has no types -- the provided package.xml was invalid, empty, or not provided.',
    );
  });

  it('does not fail when fail-on-empty is false even with no types', async () => {
    stubInputs({ 'package-xml': 'package.xml' }, { 'fail-on-empty': false });
    packageXmlToListMock.mockResolvedValue({ packageList: '', warnings: [] });
    parseManifestXmlMock.mockReturnValue({ types: [], version: null });

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('does not fail when fail-on-empty is true but there are types', async () => {
    stubInputs({ 'package-xml': 'package.xml' }, { 'fail-on-empty': true });
    packageXmlToListMock.mockResolvedValue({ packageList: 'ApexClass: A', warnings: [] });

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('fails the action with the error message when packageXmlToList throws', async () => {
    stubInputs({ 'package-xml': 'package.xml' });
    packageXmlToListMock.mockRejectedValue(new Error('boom'));

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('boom');
  });

  it('fails the action with String(error) when the thrown value is not an Error instance', async () => {
    stubInputs({ 'package-xml': 'package.xml' });
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    packageXmlToListMock.mockRejectedValue('a plain string rejection');

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('a plain string rejection');
  });
});
