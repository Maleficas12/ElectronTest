import { useEffect, useState } from 'react';
import { AppInfo } from '@shared/channels';
import { getAppInfo } from '../services/tauri-api.service';

export function useAppInfo(): AppInfo | null {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    void getAppInfo().then(setAppInfo).catch(console.error);
  }, []);

  return appInfo;
}
