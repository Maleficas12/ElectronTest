import { AppInfo } from '@shared/channels';

export type ElectronApi = {
  getAppInfo: () => Promise<AppInfo>;
};

export function getElectronApi(): ElectronApi | undefined {
  return window.electronApi;
}
