import { createHash } from 'node:crypto';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import {
  isJpegExtension,
  isRawImageExtension,
  OUTPUT_BUCKETS,
  SESSION_FILE_NAME,
  toAssetFileExtension,
} from '../../shared/constants';
import type {
  AssetFile,
  AssetFileExtension,
  AssetFileRole,
  AssetPreview,
  AssetType,
  FolderScanResult,
  ImageAsset,
} from '../../shared/types';

interface PreviewRegistry {
  register(assetId: string, filePath: string): string;
}

interface FileGroup {
  basename: string;
  files: AssetFile[];
}

interface ScanEntryDirent {
  isDirectory(): boolean;
  isFile(): boolean;
  name: string;
}

type ScanEntry = AssetScanEntry | UnsupportedScanEntry | null;

interface AssetScanEntry {
  basename: string;
  file: AssetFile;
  kind: 'asset';
}

interface UnsupportedScanEntry {
  kind: 'unsupported';
  name: string;
}

const IGNORED_FOLDER_NAMES = new Set<string>(Object.values(OUTPUT_BUCKETS));

export async function scanFolder(
  folderPath: string,
  previewRegistry: PreviewRegistry,
): Promise<FolderScanResult> {
  const entries = await readdir(folderPath, { withFileTypes: true });
  const groups = new Map<string, FileGroup>();
  const unsupportedFiles: string[] = [];
  const scannedEntries = await Promise.all(
    entries.map((entry) => scanEntry(folderPath, entry)),
  );

  for (const entry of scannedEntries) {
    if (!entry) {
      continue;
    }

    if (entry.kind === 'unsupported') {
      unsupportedFiles.push(entry.name);
      continue;
    }

    const groupKey = entry.basename.toLowerCase();
    const group = groups.get(groupKey) ?? {
      basename: entry.basename,
      files: [],
    };

    group.files.push(entry.file);

    groups.set(groupKey, group);
  }

  const assets = [...groups.values()]
    .filter((group) =>
      group.files.some((file) => file.role === 'raw' || file.role === 'jpeg'),
    )
    .map((group) => toImageAsset(folderPath, group, previewRegistry))
    .sort((left, right) =>
      left.displayName.localeCompare(right.displayName, undefined, {
        numeric: true,
      }),
    );

  return {
    assets,
    folderPath,
    generatedAt: new Date().toISOString(),
    unsupportedFiles,
  };
}

export function shouldIgnoreDirectory(directoryName: string): boolean {
  return IGNORED_FOLDER_NAMES.has(directoryName);
}

async function scanEntry(
  folderPath: string,
  entry: ScanEntryDirent,
): Promise<ScanEntry> {
  if (
    entry.isDirectory() ||
    !entry.isFile() ||
    entry.name === SESSION_FILE_NAME
  ) {
    return null;
  }

  const extension = toAssetFileExtension(path.extname(entry.name));

  if (!extension) {
    return {
      kind: 'unsupported',
      name: entry.name,
    };
  }

  const basename = path.basename(entry.name, path.extname(entry.name));
  const filePath = path.join(folderPath, entry.name);
  const fileStat = await stat(filePath);

  return {
    basename,
    file: {
      extension,
      modifiedAtMs: fileStat.mtimeMs,
      name: entry.name,
      path: filePath,
      role: getFileRole(extension),
      sizeBytes: fileStat.size,
    },
    kind: 'asset',
  };
}

function getFileRole(extension: AssetFileExtension): AssetFileRole {
  if (isRawImageExtension(extension)) {
    return 'raw';
  }

  if (isJpegExtension(extension)) {
    return 'jpeg';
  }

  return 'sidecar';
}

function toImageAsset(
  folderPath: string,
  group: FileGroup,
  previewRegistry: PreviewRegistry,
): ImageAsset {
  const rawFiles = group.files.filter((file) => file.role === 'raw');
  const jpegFiles = group.files.filter((file) => file.role === 'jpeg');
  const type = getAssetType(rawFiles, jpegFiles);
  const id = createAssetId(folderPath, group.basename);
  const preview = getAssetPreview(id, type, jpegFiles, previewRegistry);

  return {
    basename: group.basename,
    displayName: group.basename,
    files: sortAssetFiles(group.files),
    id,
    preview,
    type,
  };
}

function getAssetType(
  rawFiles: AssetFile[],
  jpegFiles: AssetFile[],
): AssetType {
  if (rawFiles.length > 0 && jpegFiles.length > 0) {
    return 'raw+jpeg';
  }

  if (rawFiles.length > 0) {
    return 'raw';
  }

  return 'jpeg';
}

function getAssetPreview(
  assetId: string,
  type: AssetType,
  jpegFiles: AssetFile[],
  previewRegistry: PreviewRegistry,
): AssetPreview {
  if (jpegFiles.length > 0) {
    const jpeg = sortAssetFiles(jpegFiles)[0];

    if (jpeg) {
      return {
        kind: 'jpeg',
        url: previewRegistry.register(assetId, jpeg.path),
      };
    }
  }

  if (type === 'raw') {
    return { kind: 'raw-embedded' };
  }

  return { kind: 'unavailable' };
}

function sortAssetFiles(files: AssetFile[]): AssetFile[] {
  const roleOrder: Record<AssetFileRole, number> = {
    jpeg: 1,
    raw: 0,
    sidecar: 2,
  };

  return [...files].sort((left, right) => {
    const roleDifference = roleOrder[left.role] - roleOrder[right.role];

    if (roleDifference !== 0) {
      return roleDifference;
    }

    return left.name.localeCompare(right.name);
  });
}

function createAssetId(folderPath: string, basename: string): string {
  return createHash('sha256')
    .update(folderPath)
    .update('\0')
    .update(basename.toLowerCase())
    .digest('hex')
    .slice(0, 16);
}
