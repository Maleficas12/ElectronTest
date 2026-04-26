export const APP_CHANNELS = {
  APP_INFO: 'app:info'
} as const;

export type AppInfo = {
  appName: string;
  appVersion: string;
  platform: NodeJS.Platform;
};
