import { FolderOpen, PanelRight, RefreshCcw, Route } from 'lucide-react';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import type { Decision } from '../shared/types';
import styles from './App.module.css';
import { Filmstrip } from './components/Filmstrip';
import { MetadataSidebar } from './components/MetadataSidebar';
import { MovePlanSummary } from './components/MovePlanSummary';
import { ReviewSurface } from './components/ReviewSurface';
import {
  decisionsFromAssets,
  getCurrentAssetIndex,
  getDecisionSignature,
  getMarkedAssetCount,
  initialReviewState,
  reviewReducer,
} from './lib/reviewState';
import { shouldIgnoreAppShortcutTarget } from './lib/shortcuts';

export function App() {
  const [reviewState, dispatchReview] = useReducer(
    reviewReducer,
    initialReviewState,
  );
  const [metadataVisible, setMetadataVisible] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string | undefined>();
  const busyRequestIdRef = useRef(0);
  const lastSaveSequenceRef = useRef(0);
  const movePlanRequestIdRef = useRef(0);
  const reviewStateRef = useRef(reviewState);
  const scanRequestIdRef = useRef(0);

  reviewStateRef.current = reviewState;

  const { currentAssetId, loupeEnabled, movePlan, pendingSave, scan } =
    reviewState;
  const assets = scan?.assets ?? [];
  const currentIndex = useMemo(
    () => getCurrentAssetIndex(assets, currentAssetId),
    [assets, currentAssetId],
  );
  const currentAsset = currentIndex >= 0 ? assets[currentIndex] : undefined;
  const markedAssetCount = useMemo(() => getMarkedAssetCount(assets), [assets]);

  const beginBusy = useCallback((label: string): number => {
    busyRequestIdRef.current += 1;
    setBusyLabel(label);

    return busyRequestIdRef.current;
  }, []);

  const endBusy = useCallback((requestId: number) => {
    if (busyRequestIdRef.current === requestId) {
      setBusyLabel(undefined);
    }
  }, []);

  const beginScanRequest = useCallback((): number => {
    movePlanRequestIdRef.current += 1;
    scanRequestIdRef.current += 1;

    return scanRequestIdRef.current;
  }, []);

  const beginMovePlanRequest = useCallback((): number => {
    movePlanRequestIdRef.current += 1;

    return movePlanRequestIdRef.current;
  }, []);

  const chooseFolder = useCallback(async () => {
    const busyRequestId = beginBusy('Choosing folder...');
    const scanRequestId = beginScanRequest();

    try {
      const result = await window.cullinary.chooseFolder();

      if (result && scanRequestId === scanRequestIdRef.current) {
        startTransition(() => {
          dispatchReview({ scan: result, type: 'scan-loaded' });
        });
      }
    } finally {
      endBusy(busyRequestId);
    }
  }, [beginBusy, beginScanRequest, endBusy]);

  const rescan = useCallback(async () => {
    const folderPath = reviewStateRef.current.scan?.folderPath;

    if (!folderPath) {
      return;
    }

    const busyRequestId = beginBusy('Scanning...');
    const scanRequestId = beginScanRequest();

    try {
      const result = await window.cullinary.rescanFolder(folderPath);

      if (
        scanRequestId !== scanRequestIdRef.current ||
        result.folderPath !== folderPath
      ) {
        return;
      }

      startTransition(() => {
        dispatchReview({ scan: result, type: 'scan-rescanned' });
      });
    } finally {
      endBusy(busyRequestId);
    }
  }, [beginBusy, beginScanRequest, endBusy]);

  const selectAsset = useCallback((assetId: string) => {
    dispatchReview({ assetId, type: 'select-asset' });
  }, []);

  const moveBy = useCallback((offset: number) => {
    dispatchReview({ offset, type: 'move-by' });
  }, []);

  const markDecision = useCallback((decision: Decision) => {
    movePlanRequestIdRef.current += 1;
    scanRequestIdRef.current += 1;
    dispatchReview({ decision, type: 'mark-decision' });
  }, []);

  const createMovePlan = useCallback(async () => {
    const currentScan = reviewStateRef.current.scan;

    if (!currentScan) {
      return;
    }

    const decisions = decisionsFromAssets(currentScan.assets);
    const folderPath = currentScan.folderPath;
    const decisionSignature = getDecisionSignature(currentScan.assets);
    const busyRequestId = beginBusy('Creating move plan...');
    const movePlanRequestId = beginMovePlanRequest();

    dispatchReview({ type: 'clear-move-plan' });
    try {
      const plan = await window.cullinary.createMovePlan({
        decisions,
        folderPath,
      });
      const latestScan = reviewStateRef.current.scan;

      if (
        movePlanRequestId !== movePlanRequestIdRef.current ||
        !latestScan ||
        latestScan.folderPath !== folderPath ||
        getDecisionSignature(latestScan.assets) !== decisionSignature
      ) {
        return;
      }

      dispatchReview({ movePlan: plan, type: 'move-plan-created' });
    } finally {
      endBusy(busyRequestId);
    }
  }, [beginBusy, beginMovePlanRequest, endBusy]);

  useEffect(() => {
    if (!pendingSave || pendingSave.sequence <= lastSaveSequenceRef.current) {
      return;
    }

    lastSaveSequenceRef.current = pendingSave.sequence;
    void window.cullinary.saveDecision(pendingSave.request);
  }, [pendingSave]);

  useEffect(() => {
    const shortcutHandlers: Record<string, () => void> = {
      ' ': () => dispatchReview({ type: 'toggle-loupe' }),
      arrowleft: () => moveBy(-1),
      arrowright: () => moveBy(1),
      e: () => markDecision('edit'),
      p: () => markDecision('keep'),
      x: () => markDecision('reject'),
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        shouldIgnoreAppShortcutTarget(event.target)
      ) {
        return;
      }

      const handler = shortcutHandlers[event.key.toLowerCase()];
      if (!handler) {
        return;
      }

      event.preventDefault();
      handler();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [markDecision, moveBy]);

  return (
    <div className={styles.shell}>
      <header className={styles.toolbar}>
        <div className={styles.brand}>Cullinary</div>
        <div className={styles.actions}>
          <button
            className={styles.toolbarButton}
            onClick={chooseFolder}
            type="button"
          >
            <FolderOpen size={17} />
            <span>Open Folder</span>
          </button>
          <button
            className={styles.toolbarButton}
            disabled={!scan}
            onClick={rescan}
            type="button"
          >
            <RefreshCcw size={17} />
            <span>Rescan</span>
          </button>
          <button
            className={styles.toolbarButton}
            disabled={!scan || markedAssetCount === 0}
            onClick={createMovePlan}
            type="button"
          >
            <Route size={17} />
            <span>Move Plan</span>
          </button>
          <button
            aria-pressed={metadataVisible}
            className={styles.toolbarButton}
            disabled={!currentAsset}
            onClick={() => setMetadataVisible((visible) => !visible)}
            type="button"
          >
            <PanelRight size={17} />
            <span>Metadata</span>
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.workspaceMain}>
          <ReviewSurface asset={currentAsset} loupeEnabled={loupeEnabled} />
          <Filmstrip
            assets={assets}
            currentAssetId={currentAsset?.id}
            onSelectAsset={selectAsset}
          />
        </div>
        <MetadataSidebar asset={currentAsset} visible={metadataVisible} />
      </div>

      <footer className={styles.statusbar}>
        <span className={styles.statusText}>
          {busyLabel ?? scan?.folderPath ?? 'No folder selected'}
        </span>
        <span className={styles.statusText}>
          {currentAsset ? currentAsset.displayName : ''}
        </span>
      </footer>

      <MovePlanSummary movePlan={movePlan} />
    </div>
  );
}
