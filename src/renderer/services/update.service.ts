import { relaunch } from '@tauri-apps/plugin-process';
import { check, DownloadEvent, Update } from '@tauri-apps/plugin-updater';

export type AvailableUpdate = {
  currentVersion: string;
  version: string;
  date?: string;
  body?: string;
};

export type UpdateProgress = {
  downloadedBytes: number;
  contentLength?: number;
};

export async function checkForUpdate(): Promise<Update | null> {
  if (!('__TAURI_INTERNALS__' in window)) {
    return null;
  }

  return check();
}

export function getUpdateMetadata(update: Update): AvailableUpdate {
  return {
    currentVersion: update.currentVersion,
    version: update.version,
    date: update.date,
    body: update.body
  };
}

export async function installUpdate(
  update: Update,
  onProgress: (progress: UpdateProgress) => void
): Promise<void> {
  let downloadedBytes = 0;
  let contentLength: number | undefined;

  await update.downloadAndInstall((event: DownloadEvent) => {
    if (event.event === 'Started') {
      downloadedBytes = 0;
      contentLength = event.data.contentLength;
      onProgress({ downloadedBytes, contentLength });
      return;
    }

    if (event.event === 'Progress') {
      downloadedBytes += event.data.chunkLength;
      onProgress({ downloadedBytes, contentLength });
    }
  });

  await relaunch();
}
