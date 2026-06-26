import path from 'node:path';
import { app, BrowserWindow, Menu } from 'electron';

import { registerIpcHandlers } from './ipc';
import {
  PreviewRegistry,
  registerPreviewProtocol,
  registerPreviewSchemeAsPrivileged,
} from './services/previewRegistry';

registerPreviewSchemeAsPrivileged();

app.disableHardwareAcceleration();

const previewRegistry = new PreviewRegistry();

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    backgroundColor: '#101214',
    height: 900,
    minHeight: 720,
    minWidth: 1080,
    show: false,
    title: 'Cullinary',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
    },
    width: 1440,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  registerPreviewProtocol(previewRegistry);
  registerIpcHandlers({ previewRegistry });
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
