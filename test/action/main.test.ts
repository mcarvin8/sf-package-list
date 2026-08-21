import * as core from '@actions/core';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { run } from '../../src/action/main.js';
import { runToList } from '../../src/action/toList.js';
import { runToXml } from '../../src/action/toXml.js';

vi.mock('@actions/core');
vi.mock('../../src/action/toList.js');
vi.mock('../../src/action/toXml.js');

const runToListMock = runToList as unknown as Mock;
const runToXmlMock = runToXml as unknown as Mock;
const getInputMock = core.getInput as unknown as Mock;

describe('GitHub Action entrypoint (dispatcher)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches to runToList when mode is "to-list"', async () => {
    getInputMock.mockReturnValue('to-list');

    await run();

    expect(getInputMock).toHaveBeenCalledWith('mode', { required: true });
    expect(runToListMock).toHaveBeenCalledOnce();
    expect(runToXmlMock).not.toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('dispatches to runToXml when mode is "to-xml"', async () => {
    getInputMock.mockReturnValue('to-xml');

    await run();

    expect(runToXmlMock).toHaveBeenCalledOnce();
    expect(runToListMock).not.toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('fails the action when mode is an unrecognized value', async () => {
    getInputMock.mockReturnValue('bogus');

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Invalid mode "bogus". Expected "to-list" or "to-xml".');
    expect(runToListMock).not.toHaveBeenCalled();
    expect(runToXmlMock).not.toHaveBeenCalled();
  });

  it('fails the action with the error message when getInput throws (e.g. missing required mode)', async () => {
    getInputMock.mockImplementation(() => {
      throw new Error('Input required and not supplied: mode');
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Input required and not supplied: mode');
  });

  it('fails the action with String(error) when the thrown value is not an Error instance', async () => {
    getInputMock.mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'a plain string throw';
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('a plain string throw');
  });
});
