import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { scanFolder } from '../main/services/assetScanner';
import { createMovePlan } from '../main/services/movePlanner';

const previewRegistry = {
  register: (assetId: string) => `cullinary-preview://asset/${assetId}`,
};

let temporaryFolders: string[] = [];

describe('createMovePlan', () => {
  afterEach(async () => {
    await Promise.all(
      temporaryFolders.map((folder) =>
        rm(folder, { force: true, recursive: true }),
      ),
    );
    temporaryFolders = [];
  });

  it('maps decisions to the accepted output folders', async () => {
    const folder = await makeFolder();

    await writeFile(path.join(folder, 'IMG_1001.JPG'), '');

    const scan = await scanFolder(folder, previewRegistry);
    const asset = expectFirst(scan.assets, 'asset');
    const plan = await createMovePlan(folder, scan.assets, {
      [asset.id]: 'keep',
    });
    const item = expectFirst(plan.items, 'move plan item');
    const file = expectFirst(item.files, 'move plan file');

    expect(plan.items).toHaveLength(1);
    expect(file.destinationPath).toBe(
      path.join(folder, '_keep', 'IMG_1001.JPG'),
    );
    expect(item.status).toBe('ready');
  });

  it('flags conflicts and suggests copy suffix rename destinations', async () => {
    const folder = await makeFolder();

    await writeFile(path.join(folder, 'IMG_1002.JPG'), '');
    await mkdir(path.join(folder, '_edit'));
    await writeFile(path.join(folder, '_edit', 'IMG_1002.JPG'), '');

    const scan = await scanFolder(folder, previewRegistry);
    const asset = expectFirst(scan.assets, 'asset');
    const plan = await createMovePlan(folder, scan.assets, {
      [asset.id]: 'edit',
    });
    const item = expectFirst(plan.items, 'move plan item');
    const file = expectFirst(item.files, 'move plan file');

    expect(item.status).toBe('conflict');
    expect(file).toMatchObject({
      conflict: true,
      resolvedDestinationPath: path.join(
        folder,
        '_edit',
        'IMG_1002-copy-02.JPG',
      ),
    });
  });
});

async function makeFolder(): Promise<string> {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'cullinary-'));

  temporaryFolders.push(folder);

  return folder;
}

function expectFirst<T>(items: T[], label: string): T {
  const [item] = items;

  if (item === undefined) {
    throw new Error(`Expected at least one ${label}`);
  }

  return item;
}
