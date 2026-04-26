import { app } from 'electron';
import { AppInfo } from '../../shared/channels';

export function getAppInfo(): AppInfo {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
    platform: process.platform
  };
}
