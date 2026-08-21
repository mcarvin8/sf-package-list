'use strict';

import * as core from '@actions/core';

import { runToList } from './toList.js';
import { runToXml } from './toXml.js';

export async function run(): Promise<void> {
  try {
    const mode = core.getInput('mode', { required: true });

    if (mode === 'to-list') {
      await runToList();
    } else if (mode === 'to-xml') {
      await runToXml();
    } else {
      core.setFailed(`Invalid mode "${mode}". Expected "to-list" or "to-xml".`);
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}
