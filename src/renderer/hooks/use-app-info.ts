import { useEffect, useState } from 'react';
import { AppInfo } from '@shared/channels';
import { getElectronApi } from '../services/electron-api.service';

export function useAppInfo(): AppInfo | null {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    const api = getElectronApi();

    if (!api) return;

    void api.getAppInfo().then(setAppInfo).catch(console.error);
  }, []);

  return appInfo;
}
