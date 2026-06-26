import { describe, expect, it } from 'vitest';

import { initialReviewState, reviewReducer } from '../renderer/lib/reviewState';
import type { Decision, FolderScanResult, ImageAsset } from '../shared/types';

describe('reviewReducer', () => {
  it('marks the current asset, autosaves the active position, and advances to the next asset', () => {
    const initialState = {
      ...initialReviewState,
      currentAssetId: 'asset-a',
      scan: makeScan([makeAsset('asset-a'), makeAsset('asset-b')]),
    };

    const nextState = reviewReducer(initialState, {
      decision: 'keep',
      type: 'mark-decision',
    });

    expect(nextState.currentAssetId).toBe('asset-b');
    expect(nextState.scan?.assets.map((asset) => asset.decision)).toEqual([
      'keep',
      undefined,
    ]);
    expect(nextState.pendingSave?.request).toEqual({
      activeAssetId: 'asset-b',
      assetIds: ['asset-a', 'asset-b'],
      decisions: {
        'asset-a': 'keep',
      },
      folderPath: '/photos',
    });
  });

  it('handles one-keystroke-per-image culling without losing earlier decisions', () => {
    const initialState = {
      ...initialReviewState,
      currentAssetId: 'asset-a',
      scan: makeScan([
        makeAsset('asset-a'),
        makeAsset('asset-b'),
        makeAsset('asset-c'),
      ]),
    };

    const firstState = reviewReducer(initialState, {
      decision: 'keep',
      type: 'mark-decision',
    });
    const secondState = reviewReducer(firstState, {
      decision: 'reject',
      type: 'mark-decision',
    });

    expect(secondState.currentAssetId).toBe('asset-c');
    expect(secondState.scan?.assets.map((asset) => asset.decision)).toEqual([
      'keep',
      'reject',
      undefined,
    ]);
    expect(secondState.pendingSave?.request).toMatchObject({
      activeAssetId: 'asset-c',
      decisions: {
        'asset-a': 'keep',
        'asset-b': 'reject',
      },
      folderPath: '/photos',
    });
    expect(secondState.saveSequence).toBe(2);
  });

  it('lets reviewers navigate back and change a previous decision after auto-advance', () => {
    const initialState = {
      ...initialReviewState,
      currentAssetId: 'asset-a',
      scan: makeScan([makeAsset('asset-a'), makeAsset('asset-b')]),
    };
    const markedState = reviewReducer(initialState, {
      decision: 'keep',
      type: 'mark-decision',
    });
    const revisitedState = reviewReducer(markedState, {
      offset: -1,
      type: 'move-by',
    });
    const correctedState = reviewReducer(revisitedState, {
      decision: 'reject',
      type: 'mark-decision',
    });

    expect(correctedState.currentAssetId).toBe('asset-b');
    expect(correctedState.scan?.assets[0]?.decision).toBe('reject');
    expect(correctedState.pendingSave?.request.decisions).toEqual({
      'asset-a': 'reject',
    });
  });

  it('keeps the final asset selected after marking it', () => {
    const initialState = {
      ...initialReviewState,
      currentAssetId: 'asset-b',
      scan: makeScan([makeAsset('asset-a'), makeAsset('asset-b')]),
    };

    const nextState = reviewReducer(initialState, {
      decision: 'edit',
      type: 'mark-decision',
    });

    expect(nextState.currentAssetId).toBe('asset-b');
    expect(nextState.scan?.assets[1]?.decision).toBe('edit');
    expect(nextState.pendingSave?.request.activeAssetId).toBe('asset-b');
  });

  it('toggles the loupe for sharpness checks and resets it when review position changes', () => {
    const loadedState = {
      ...initialReviewState,
      currentAssetId: 'asset-a',
      scan: makeScan([makeAsset('asset-a'), makeAsset('asset-b')]),
    };
    const zoomedState = reviewReducer(loadedState, { type: 'toggle-loupe' });
    const movedState = reviewReducer(zoomedState, {
      offset: 1,
      type: 'move-by',
    });
    const zoomedAgainState = reviewReducer(movedState, {
      type: 'toggle-loupe',
    });
    const markedState = reviewReducer(zoomedAgainState, {
      decision: 'keep',
      type: 'mark-decision',
    });

    expect(zoomedState.loupeEnabled).toBe(true);
    expect(movedState.loupeEnabled).toBe(false);
    expect(zoomedAgainState.loupeEnabled).toBe(true);
    expect(markedState.loupeEnabled).toBe(false);
  });

  it('does not enter loupe mode before a reviewable asset exists', () => {
    const nextState = reviewReducer(initialReviewState, {
      type: 'toggle-loupe',
    });

    expect(nextState.loupeEnabled).toBe(false);
  });

  it('keeps the current asset on rescan when it still exists', () => {
    const initialState = {
      ...initialReviewState,
      currentAssetId: 'asset-b',
      scan: makeScan([makeAsset('asset-a'), makeAsset('asset-b')]),
    };
    const rescannedState = reviewReducer(initialState, {
      scan: makeScan([makeAsset('asset-a'), makeAsset('asset-b')]),
      type: 'scan-rescanned',
    });

    expect(rescannedState.currentAssetId).toBe('asset-b');
  });

  it('uses the saved session position on rescan when the current asset disappeared', () => {
    const initialState = {
      ...initialReviewState,
      currentAssetId: 'asset-a',
      scan: makeScan([makeAsset('asset-a'), makeAsset('asset-b')]),
    };
    const rescannedState = reviewReducer(initialState, {
      scan: makeScan([makeAsset('asset-b'), makeAsset('asset-c')], 'asset-c'),
      type: 'scan-rescanned',
    });

    expect(rescannedState.currentAssetId).toBe('asset-c');
  });

  it('falls back to a valid asset when a session points at a missing asset', () => {
    const loadedState = reviewReducer(initialReviewState, {
      scan: makeScan([makeAsset('asset-a')], 'missing-asset'),
      type: 'scan-loaded',
    });

    expect(loadedState.currentAssetId).toBe('asset-a');
  });
});

function makeScan(
  assets: ImageAsset[],
  activeAssetId?: string,
): FolderScanResult {
  return {
    assets,
    folderPath: '/photos',
    generatedAt: '2026-06-25T00:00:00.000Z',
    session: activeAssetId
      ? {
          activeAssetId,
          decisions: {},
          folderPath: '/photos',
          savedAt: '2026-06-25T00:00:00.000Z',
          version: 1,
        }
      : undefined,
    unsupportedFiles: [],
  };
}

function makeAsset(id: string, decision?: Decision): ImageAsset {
  const asset: ImageAsset = {
    basename: id,
    displayName: id,
    files: [],
    id,
    preview: { kind: 'unavailable' },
    type: 'jpeg',
  };

  if (decision) {
    asset.decision = decision;
  }

  return asset;
}
