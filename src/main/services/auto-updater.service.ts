import { app } from 'electron';
import { autoUpdater } from 'electron-updater';

export function configureAutoUpdates(): void {
  autoUpdater.autoDownload = false;

  if (app.isPackaged) {
    void autoUpdater.checkForUpdates().catch((error) => {
      console.error('Auto update check failed:', error);
    });
  }
}
