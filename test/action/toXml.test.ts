import { readFile } from 'node:fs/promises';

import * as core from '@actions/core';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { runToXml as run } from '../../src/action/toXml.js';
import { listToPackageXml } from '../../src/core/listToPackageXml.js';
import { parseManifestXml } from '../../src/core/parseManifest.js';

vi.mock('@actions/core');
vi.mock('node:fs/promises');
vi.mock('../../src/core/listToPackageXml.js');
vi.mock('../../src/core/parseManifest.js');

const listToPackageXmlMock = listToPackageXml as unknown as Mock;
const parseManifestXmlMock = parseManifestXml as unknown as Mock;
const readFileMock = readFile as unknown as Mock;
const getInputMock = core.getInput as unknown as Mock;
const getBooleanInputMock = core.getBooleanInput as unknown as Mock;

function stubInputs(inputs: Record<string, string>, booleanInputs: Record<string, boolean> = {}): void {
  getInputMock.mockImplementation((name: string) => inputs[name] ?? '');
  getBooleanInputMock.mockImplementation((name: string) => booleanInputs[name] ?? false);
}

const baseManifest = { types: [{ name: 'ApexClass', members: ['A'] }], version: '60.0' };

describe('GitHub Action entrypoint (to-xml)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readFileMock.mockResolvedValue('<Package></Package>');
    parseManifestXmlMock.mockReturnValue(baseManifest);
  });

  it('maps inputs to listToPackageXml, defaulting package-xml to package.xml', async () => {
    stubInputs({ 'package-list': 'package.txt' });
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'package.xml', warnings: [] });

    await run();

    expect(listToPackageXmlMock).toHaveBeenCalledWith({
      listPath: 'package.txt',
      xmlPath: 'package.xml',
      noApiVersion: false,
    });
    expect(getBooleanInputMock).toHaveBeenCalledWith('no-api-version');
    expect(getBooleanInputMock).toHaveBeenCalledWith('fail-on-empty');
  });

  it('passes undefined listPath when package-list is not provided', async () => {
    stubInputs({});
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'package.xml', warnings: [] });

    await run();

    expect(listToPackageXmlMock).toHaveBeenCalledWith(
      expect.objectContaining({ listPath: undefined, xmlPath: 'package.xml' }),
    );
  });

  it('sets outputs and logs the written path on success', async () => {
    stubInputs({ 'package-list': 'package.txt', 'package-xml': 'out.xml' });
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'out.xml', warnings: [] });

    await run();

    expect(readFileMock).toHaveBeenCalledWith('out.xml', 'utf-8');
    expect(core.setOutput).toHaveBeenCalledWith('package-xml-path', 'out.xml');
    expect(core.setOutput).toHaveBeenCalledWith('types', 1);
    expect(core.setOutput).toHaveBeenCalledWith('members', 1);
    expect(core.setOutput).toHaveBeenCalledWith('api-version', '60.0');
    expect(core.setOutput).toHaveBeenCalledWith('warnings', '');
    expect(core.info).toHaveBeenCalledWith('Package XML written to: out.xml');
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('reports an empty api-version output when the manifest has none', async () => {
    stubInputs({});
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'package.xml', warnings: [] });
    parseManifestXmlMock.mockReturnValue({ types: [], version: null });

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('api-version', '');
  });

  it('propagates warnings from listToPackageXml to core.warning and the warnings output', async () => {
    stubInputs({});
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'package.xml', warnings: ['first warning', 'second warning'] });

    await run();

    expect(core.warning).toHaveBeenCalledWith('first warning');
    expect(core.warning).toHaveBeenCalledWith('second warning');
    expect(core.setOutput).toHaveBeenCalledWith('warnings', 'first warning\nsecond warning');
  });

  it('fails the action when fail-on-empty is true and there are no types', async () => {
    stubInputs({}, { 'fail-on-empty': true });
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'package.xml', warnings: [] });
    parseManifestXmlMock.mockReturnValue({ types: [], version: null });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      'The package.xml has no <types> -- the provided list was invalid, empty, or not provided.',
    );
  });

  it('does not fail when fail-on-empty is false even with no types', async () => {
    stubInputs({}, { 'fail-on-empty': false });
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'package.xml', warnings: [] });
    parseManifestXmlMock.mockReturnValue({ types: [], version: null });

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('does not fail when fail-on-empty is true but there are types', async () => {
    stubInputs({}, { 'fail-on-empty': true });
    listToPackageXmlMock.mockResolvedValue({ xmlPath: 'package.xml', warnings: [] });

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('fails the action with the error message when listToPackageXml throws', async () => {
    stubInputs({});
    listToPackageXmlMock.mockRejectedValue(new Error('boom'));

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('boom');
  });

  it('fails the action with String(error) when the thrown value is not an Error instance', async () => {
    stubInputs({});
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    listToPackageXmlMock.mockRejectedValue('a plain string rejection');

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('a plain string rejection');
  });
});
