import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { SESSION_FILE_NAME } from '../../shared/constants';
import type {
  Decision,
  ImageAsset,
  ReviewSessionSnapshot,
} from '../../shared/types';

const pendingSessionWrites = new Map<string, Promise<ReviewSessionSnapshot>>();

export async function loadSession(
  folderPath: string,
): Promise<ReviewSessionSnapshot | null> {
  try {
    const raw = await readFile(getSessionPath(folderPath), 'utf8');
    const parsedSession: unknown = JSON.parse(raw);
    const session = parseReviewSessionSnapshot(parsedSession);

    if (!session || session.folderPath !== folderPath) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function saveSession(
  folderPath: string,
  assetIds: string[],
  decisions: Record<string, Decision>,
  activeAssetId: string,
): Promise<ReviewSessionSnapshot> {
  const session: ReviewSessionSnapshot = {
    activeAssetId,
    decisions: sanitizeDecisions(assetIds, decisions),
    folderPath,
    savedAt: new Date().toISOString(),
    version: 1,
  };

  const sessionPath = getSessionPath(folderPath);
  const temporaryPath = `${sessionPath}.tmp`;

  await writeFile(
    temporaryPath,
    `${JSON.stringify(session, null, 2)}\n`,
    'utf8',
  );
  await rename(temporaryPath, sessionPath);

  return session;
}

export function queueSessionSave(
  folderPath: string,
  assetIds: string[],
  decisions: Record<string, Decision>,
  activeAssetId: string,
): Promise<ReviewSessionSnapshot> {
  const previousWrite =
    pendingSessionWrites.get(folderPath) ?? Promise.resolve(undefined);
  const nextWrite = previousWrite
    .catch(() => undefined)
    .then(() => saveSession(folderPath, assetIds, decisions, activeAssetId))
    .finally(() => {
      if (pendingSessionWrites.get(folderPath) === nextWrite) {
        pendingSessionWrites.delete(folderPath);
      }
    });

  pendingSessionWrites.set(folderPath, nextWrite);

  return nextWrite;
}

export function applySessionDecisions(
  assets: ImageAsset[],
  session: ReviewSessionSnapshot | null,
): ImageAsset[] {
  if (!session) {
    return assets;
  }

  return assets.map((asset) => ({
    ...asset,
    decision: session.decisions[asset.id],
  }));
}

function getSessionPath(folderPath: string): string {
  return path.join(folderPath, SESSION_FILE_NAME);
}

function sanitizeDecisions(
  assetIds: string[],
  decisions: Record<string, Decision>,
): Record<string, Decision> {
  const knownAssetIds = new Set(assetIds);
  const sanitizedDecisions: Record<string, Decision> = {};

  for (const [assetId, decision] of Object.entries(decisions)) {
    if (knownAssetIds.has(assetId)) {
      sanitizedDecisions[assetId] = decision;
    }
  }

  return sanitizedDecisions;
}

function parseReviewSessionSnapshot(
  value: unknown,
): ReviewSessionSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  const decisions = parseDecisionRecord(value.decisions);

  if (
    value.version !== 1 ||
    typeof value.folderPath !== 'string' ||
    typeof value.savedAt !== 'string' ||
    !decisions
  ) {
    return null;
  }

  if (
    value.activeAssetId !== undefined &&
    typeof value.activeAssetId !== 'string'
  ) {
    return null;
  }

  return {
    activeAssetId: value.activeAssetId,
    decisions,
    folderPath: value.folderPath,
    savedAt: value.savedAt,
    version: 1,
  };
}

function parseDecisionRecord(value: unknown): Record<string, Decision> | null {
  if (!isRecord(value)) {
    return null;
  }

  const decisions: Record<string, Decision> = {};

  for (const [assetId, decision] of Object.entries(value)) {
    if (!isDecision(decision)) {
      return null;
    }

    decisions[assetId] = decision;
  }

  return decisions;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDecision(value: unknown): value is Decision {
  return value === 'reject' || value === 'keep' || value === 'edit';
}
