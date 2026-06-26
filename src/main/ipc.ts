import { dialog, ipcMain } from 'electron';

import type { MovePlanRequest, SaveDecisionRequest } from '../shared/types';
import { scanFolder } from './services/assetScanner';
import { createMovePlan } from './services/movePlanner';
import type { PreviewRegistry } from './services/previewRegistry';
import {
  applySessionDecisions,
  loadSession,
  queueSessionSave,
} from './services/sessionStore';

interface IpcServices {
  previewRegistry: PreviewRegistry;
}

export function registerIpcHandlers({ previewRegistry }: IpcServices): void {
  ipcMain.handle('folder:choose', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Choose a photo folder',
    });

    const [folderPath] = result.filePaths;

    if (result.canceled || !folderPath) {
      return null;
    }

    return scanFolderWithSession(folderPath, previewRegistry);
  });

  ipcMain.handle('folder:scan', (_event, folderPath: string) => {
    return scanFolderWithSession(folderPath, previewRegistry);
  });

  ipcMain.handle('session:load', (_event, folderPath: string) => {
    return loadSession(folderPath);
  });

  ipcMain.handle('decision:save', (_event, request: SaveDecisionRequest) => {
    return queueSessionSave(
      request.folderPath,
      request.assetIds,
      request.decisions,
      request.activeAssetId,
    );
  });

  ipcMain.handle(
    'move:createPlan',
    async (_event, request: MovePlanRequest) => {
      const scan = await scanFolderWithSession(
        request.folderPath,
        previewRegistry,
      );

      return createMovePlan(request.folderPath, scan.assets, request.decisions);
    },
  );
}

async function scanFolderWithSession(
  folderPath: string,
  previewRegistry: PreviewRegistry,
) {
  previewRegistry.clear();

  const [scan, session] = await Promise.all([
    scanFolder(folderPath, previewRegistry),
    loadSession(folderPath),
  ]);
  const assets = applySessionDecisions(scan.assets, session);

  return {
    ...scan,
    assets,
    session: session ?? undefined,
  };
}
