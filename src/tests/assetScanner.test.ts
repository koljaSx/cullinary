import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { scanFolder } from '../main/services/assetScanner';

const previewRegistry = {
  register: (assetId: string) => `cullinary-preview://asset/${assetId}`,
};

let temporaryFolders: string[] = [];

describe('scanFolder', () => {
  afterEach(async () => {
    await Promise.all(
      temporaryFolders.map((folder) =>
        rm(folder, { force: true, recursive: true }),
      ),
    );
    temporaryFolders = [];
  });

  it('groups RAW, JPEG, and XMP files with the same basename', async () => {
    const folder = await makeFolder();

    await writeFile(path.join(folder, 'IMG_1001.CR3'), '');
    await writeFile(path.join(folder, 'IMG_1001.JPG'), '');
    await writeFile(path.join(folder, 'IMG_1001.XMP'), '');

    const result = await scanFolder(folder, previewRegistry);

    expect(result.assets).toHaveLength(1);
    const asset = expectFirst(result.assets, 'asset');

    expect(asset).toMatchObject({
      basename: 'IMG_1001',
      type: 'raw+jpeg',
    });
    expect(asset.files.map((file) => file.role)).toEqual([
      'raw',
      'jpeg',
      'sidecar',
    ]);
    expect(asset.preview.kind).toBe('jpeg');
  });

  it('keeps RAW-only and JPEG-only assets reviewable', async () => {
    const folder = await makeFolder();

    await writeFile(path.join(folder, 'RAW_ONLY.NEF'), '');
    await writeFile(path.join(folder, 'JPEG_ONLY.jpeg'), '');

    const result = await scanFolder(folder, previewRegistry);

    expect(result.assets.map((asset) => asset.type)).toEqual(['jpeg', 'raw']);
  });

  it('does not include unsupported files as assets', async () => {
    const folder = await makeFolder();

    await writeFile(path.join(folder, 'notes.txt'), '');

    const result = await scanFolder(folder, previewRegistry);

    expect(result.assets).toHaveLength(0);
    expect(result.unsupportedFiles).toEqual(['notes.txt']);
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
