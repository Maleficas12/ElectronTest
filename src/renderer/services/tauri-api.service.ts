import { invoke } from '@tauri-apps/api/core';
import { AppInfo } from '@shared/channels';

export async function getAppInfo(): Promise<AppInfo> {
  return invoke<AppInfo>('get_app_info');
}
