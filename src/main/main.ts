import { app, ipcMain, BrowserWindow } from 'electron';
import { APP_CHANNELS } from '../shared/channels';
import { getAppInfo } from './services/app-info.service';
import { configureAutoUpdates } from './services/auto-updater.service';
import { createMainWindow } from './windows/main-window';

function registerIpcHandlers(): void {
  ipcMain.handle(APP_CHANNELS.APP_INFO, () => getAppInfo());
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createMainWindow();
  configureAutoUpdates();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});