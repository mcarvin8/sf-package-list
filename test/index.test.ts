import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import * as api from '../src/index.js';

describe('public API', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'sfpl-api-'));
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('exposes only the documented functions', () => {
    expect(Object.keys(api).sort()).toEqual(['listToPackageXml', 'packageXmlToList', 'parseManifestXml']);
  });

  it('round-trips a list through package.xml', async () => {
    const listPath = join(dir, 'in.txt');
    const xmlPath = join(dir, 'package.xml');
    const outListPath = join(dir, 'out.txt');
    const list = 'ApexClass: A, B\nCustomObject: Account\nVersion: 60.0';
    await writeFile(listPath, list);

    const toXml = await api.listToPackageXml({ listPath, xmlPath, noApiVersion: false });
    expect(toXml).toEqual({ xmlPath, warnings: [], types: 2 });

    const parsed = api.parseManifestXml(await readFile(xmlPath, 'utf-8'));
    expect(parsed).toEqual({
      types: [
        { name: 'ApexClass', members: ['A', 'B'] },
        { name: 'CustomObject', members: ['Account'] },
      ],
      version: '60.0',
    });

    const toList = await api.packageXmlToList({ xmlPath, listPath: outListPath, noApiVersion: false });
    expect(toList).toEqual({ packageList: list, warnings: [] });
    expect(await readFile(outListPath, 'utf-8')).toBe(list);
  });
});
