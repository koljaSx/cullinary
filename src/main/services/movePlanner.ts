import { access } from 'node:fs/promises';
import path from 'node:path';

import { OUTPUT_BUCKETS } from '../../shared/constants';
import type {
  Decision,
  ImageAsset,
  MovePlan,
  MovePlanFile,
  MovePlanItem,
} from '../../shared/types';

export async function createMovePlan(
  folderPath: string,
  assets: ImageAsset[],
  decisions: Record<string, Decision>,
): Promise<MovePlan> {
  const items: MovePlanItem[] = [];

  for (const asset of assets) {
    const decision = decisions[asset.id];

    if (!decision) {
      continue;
    }

    const bucket = OUTPUT_BUCKETS[decision];
    const destinationFolder = path.join(folderPath, bucket);
    const files = await Promise.all(
      asset.files.map(async (file): Promise<MovePlanFile> => {
        const destinationPath = path.join(destinationFolder, file.name);
        const conflict = await pathExists(destinationPath);

        return {
          conflict,
          destinationPath,
          extension: file.extension,
          name: file.name,
          resolvedDestinationPath: conflict
            ? await getCopyDestination(destinationFolder, file.name)
            : destinationPath,
          sourcePath: file.path,
        };
      }),
    );
    const conflict = files.some((file) => file.conflict);

    items.push({
      assetId: asset.id,
      conflict,
      decision,
      files,
      resolution: conflict ? undefined : undefined,
      status: conflict ? 'conflict' : 'ready',
    });
  }

  return {
    createdAt: new Date().toISOString(),
    folderPath,
    items,
  };
}

async function getCopyDestination(
  destinationFolder: string,
  fileName: string,
): Promise<string> {
  const extension = path.extname(fileName);
  const basename = path.basename(fileName, extension);

  for (let copyIndex = 2; copyIndex < 1000; copyIndex += 1) {
    const candidate = path.join(
      destinationFolder,
      `${basename}-copy-${String(copyIndex).padStart(2, '0')}${extension}`,
    );

    if (!(await pathExists(candidate))) {
      return candidate;
    }
  }

  return path.join(
    destinationFolder,
    `${basename}-copy-${Date.now()}${extension}`,
  );
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
