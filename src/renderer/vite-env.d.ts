/// <reference types="vite/client" />

declare global {
  interface Window {
    electronApi?: {
      getAppInfo: () => Promise<import('@shared/channels').AppInfo>;
    };
  }
}

export {};
