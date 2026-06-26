import type {
  Decision,
  FolderScanResult,
  ImageAsset,
  MovePlan,
  SaveDecisionRequest,
} from '../../shared/types';

export interface PendingSaveRequest {
  request: SaveDecisionRequest;
  sequence: number;
}

export interface ReviewState {
  currentAssetId?: string;
  loupeEnabled: boolean;
  movePlan?: MovePlan;
  pendingSave?: PendingSaveRequest;
  saveSequence: number;
  scan: FolderScanResult | null;
}

export type ReviewAction =
  | { scan: FolderScanResult; type: 'scan-loaded' }
  | { scan: FolderScanResult; type: 'scan-rescanned' }
  | { assetId: string; type: 'select-asset' }
  | { offset: number; type: 'move-by' }
  | { type: 'toggle-loupe' }
  | { decision: Decision; type: 'mark-decision' }
  | { movePlan: MovePlan; type: 'move-plan-created' }
  | { type: 'clear-move-plan' };

export const initialReviewState: ReviewState = {
  loupeEnabled: false,
  saveSequence: 0,
  scan: null,
};

export function reviewReducer(
  state: ReviewState,
  action: ReviewAction,
): ReviewState {
  switch (action.type) {
    case 'scan-loaded':
      return {
        ...state,
        currentAssetId: resolveActiveAssetId(
          action.scan.assets,
          action.scan.session?.activeAssetId,
        ),
        loupeEnabled: false,
        movePlan: undefined,
        pendingSave: undefined,
        scan: action.scan,
      };

    case 'scan-rescanned':
      return {
        ...state,
        currentAssetId: resolveActiveAssetId(
          action.scan.assets,
          state.currentAssetId,
          action.scan.session?.activeAssetId,
        ),
        movePlan: undefined,
        pendingSave: undefined,
        scan: action.scan,
      };

    case 'select-asset':
      if (!state.scan?.assets.some((asset) => asset.id === action.assetId)) {
        return state;
      }

      return {
        ...state,
        currentAssetId: action.assetId,
        loupeEnabled: false,
      };

    case 'move-by': {
      const nextAssetId = getOffsetAssetId(
        state.scan?.assets ?? [],
        state.currentAssetId,
        action.offset,
      );

      if (!nextAssetId) {
        return state;
      }

      return {
        ...state,
        currentAssetId: nextAssetId,
        loupeEnabled: false,
      };
    }

    case 'toggle-loupe':
      if (!getCurrentAsset(state.scan?.assets ?? [], state.currentAssetId)) {
        return state;
      }

      return {
        ...state,
        loupeEnabled: !state.loupeEnabled,
      };

    case 'mark-decision': {
      if (!state.scan) {
        return state;
      }

      const decisionUpdate = createDecisionUpdate(
        state.scan,
        state.currentAssetId,
        action.decision,
      );

      if (!decisionUpdate) {
        return state;
      }

      const saveSequence = state.saveSequence + 1;

      return {
        ...state,
        currentAssetId: decisionUpdate.currentAssetId,
        loupeEnabled: false,
        movePlan: undefined,
        pendingSave: {
          request: decisionUpdate.saveRequest,
          sequence: saveSequence,
        },
        saveSequence,
        scan: decisionUpdate.scan,
      };
    }

    case 'move-plan-created':
      return {
        ...state,
        movePlan: action.movePlan,
      };

    case 'clear-move-plan':
      if (!state.movePlan) {
        return state;
      }

      return {
        ...state,
        movePlan: undefined,
      };
  }
}

export function getCurrentAssetIndex(
  assets: ImageAsset[],
  currentAssetId?: string,
): number {
  if (assets.length === 0) {
    return -1;
  }

  if (!currentAssetId) {
    return 0;
  }

  return assets.findIndex((asset) => asset.id === currentAssetId);
}

export function getCurrentAsset(
  assets: ImageAsset[],
  currentAssetId?: string,
): ImageAsset | undefined {
  const currentIndex = getCurrentAssetIndex(assets, currentAssetId);

  return currentIndex >= 0 ? assets[currentIndex] : undefined;
}

export function getMarkedAssetCount(assets: ImageAsset[]): number {
  return assets.reduce(
    (markedCount, asset) => markedCount + (asset.decision ? 1 : 0),
    0,
  );
}

export function decisionsFromAssets(
  assets: ImageAsset[],
): Record<string, Decision> {
  const decisions: Record<string, Decision> = {};

  for (const asset of assets) {
    if (asset.decision) {
      decisions[asset.id] = asset.decision;
    }
  }

  return decisions;
}

export function getDecisionSignature(assets: ImageAsset[]): string {
  return assets
    .filter((asset) => asset.decision)
    .map((asset) => `${asset.id}:${asset.decision}`)
    .join('\0');
}

export function resolveActiveAssetId(
  assets: ImageAsset[],
  preferredAssetId?: string,
  fallbackAssetId?: string,
): string | undefined {
  const assetIds = new Set(assets.map((asset) => asset.id));

  if (preferredAssetId && assetIds.has(preferredAssetId)) {
    return preferredAssetId;
  }

  if (fallbackAssetId && assetIds.has(fallbackAssetId)) {
    return fallbackAssetId;
  }

  return assets[0]?.id;
}

interface DecisionUpdate {
  currentAssetId: string;
  saveRequest: SaveDecisionRequest;
  scan: FolderScanResult;
}

function createDecisionUpdate(
  scan: FolderScanResult,
  currentAssetId: string | undefined,
  decision: Decision,
): DecisionUpdate | undefined {
  const currentIndex = getCurrentAssetIndex(scan.assets, currentAssetId);
  const currentAsset =
    currentIndex >= 0 ? scan.assets[currentIndex] : undefined;

  if (!currentAsset) {
    return undefined;
  }

  const nextAsset =
    scan.assets[Math.min(currentIndex + 1, scan.assets.length - 1)] ??
    currentAsset;
  const updatedAssets = scan.assets.map((asset) =>
    asset.id === currentAsset.id ? { ...asset, decision } : asset,
  );
  const activeAssetId = nextAsset.id;

  return {
    currentAssetId: activeAssetId,
    saveRequest: {
      activeAssetId,
      assetIds: updatedAssets.map((asset) => asset.id),
      decisions: decisionsFromAssets(updatedAssets),
      folderPath: scan.folderPath,
    },
    scan: {
      ...scan,
      assets: updatedAssets,
    },
  };
}

function getOffsetAssetId(
  assets: ImageAsset[],
  currentAssetId: string | undefined,
  offset: number,
): string | undefined {
  const currentIndex = getCurrentAssetIndex(assets, currentAssetId);

  if (currentIndex < 0) {
    return undefined;
  }

  const nextIndex = Math.min(
    Math.max(currentIndex + offset, 0),
    assets.length - 1,
  );

  return assets[nextIndex]?.id;
}
