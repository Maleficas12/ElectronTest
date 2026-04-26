import { contextBridge, ipcRenderer } from 'electron';
import { APP_CHANNELS, AppInfo } from '../shared/channels';

const electronApi = {
  getAppInfo: (): Promise<AppInfo> => ipcRenderer.invoke(APP_CHANNELS.APP_INFO)
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
