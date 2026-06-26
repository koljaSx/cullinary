import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { loadSession, queueSessionSave } from '../main/services/sessionStore';

let temporaryFolders: string[] = [];

describe('queueSessionSave', () => {
  afterEach(async () => {
    await Promise.all(
      temporaryFolders.map((folder) =>
        rm(folder, { force: true, recursive: true }),
      ),
    );
    temporaryFolders = [];
  });

  it('preserves rapid decision updates in write order', async () => {
    const folder = await makeFolder();
    const assetIds = ['asset-a', 'asset-b'];

    await Promise.all([
      queueSessionSave(folder, assetIds, { 'asset-a': 'keep' }, 'asset-b'),
      queueSessionSave(
        folder,
        assetIds,
        { 'asset-a': 'keep', 'asset-b': 'edit' },
        'asset-b',
      ),
    ]);

    const session = await loadSession(folder);

    expect(session?.decisions).toEqual({
      'asset-a': 'keep',
      'asset-b': 'edit',
    });
  });
});

async function makeFolder(): Promise<string> {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'cullinary-session-'));

  temporaryFolders.push(folder);

  return folder;
}
