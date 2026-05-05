import { useCallback, useEffect, useRef, useState } from 'react';
import { Update } from '@tauri-apps/plugin-updater';
import {
  AvailableUpdate,
  checkForUpdate,
  getUpdateMetadata,
  installUpdate,
  UpdateProgress
} from '../services/update.service';

type UpdateStatus =
  | 'checking'
  | 'idle'
  | 'available'
  | 'installing'
  | 'installed'
  | 'error'
  | 'dismissed';

type UseUpdaterResult = {
  status: UpdateStatus;
  update: AvailableUpdate | null;
  progress: UpdateProgress | null;
  error: string | null;
  install: () => Promise<void>;
  dismiss: () => void;
};

export function useUpdater(): UseUpdaterResult {
  const pendingUpdate = useRef<Update | null>(null);
  const didCheck = useRef(false);
  const [status, setStatus] = useState<UpdateStatus>('checking');
  const [update, setUpdate] = useState<AvailableUpdate | null>(null);
  const [progress, setProgress] = useState<UpdateProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didCheck.current) {
      return;
    }

    didCheck.current = true;
    let active = true;

    void checkForUpdate()
      .then((nextUpdate) => {
        if (!active) {
          return;
        }

        pendingUpdate.current = nextUpdate;
        setUpdate(nextUpdate ? getUpdateMetadata(nextUpdate) : null);
        setStatus(nextUpdate ? 'available' : 'idle');
      })
      .catch((reason: unknown) => {
        if (!active) {
          return;
        }

        console.info('Update check skipped or failed.', reason);
        setError(reason instanceof Error ? reason.message : 'Update check failed.');
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const install = useCallback(async () => {
    if (!pendingUpdate.current) {
      return;
    }

    setStatus('installing');
    setError(null);

    try {
      await installUpdate(pendingUpdate.current, setProgress);
      setStatus('installed');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Update installation failed.');
      setStatus('error');
    }
  }, []);

  const dismiss = useCallback(() => {
    setStatus('dismissed');
  }, []);

  return {
    status,
    update,
    progress,
    error,
    install,
    dismiss
  };
}
