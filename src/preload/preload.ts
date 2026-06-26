import { contextBridge, ipcRenderer } from 'electron';

import type {
  CullinaryApi,
  MovePlanRequest,
  SaveDecisionRequest,
} from '../shared/types';

const api: CullinaryApi = {
  chooseFolder: () => ipcRenderer.invoke('folder:choose'),
  createMovePlan: (request: MovePlanRequest) =>
    ipcRenderer.invoke('move:createPlan', request),
  loadSession: (folderPath: string) =>
    ipcRenderer.invoke('session:load', folderPath),
  rescanFolder: (folderPath: string) =>
    ipcRenderer.invoke('folder:scan', folderPath),
  saveDecision: (request: SaveDecisionRequest) =>
    ipcRenderer.invoke('decision:save', request),
};

contextBridge.exposeInMainWorld('cullinary', api);
