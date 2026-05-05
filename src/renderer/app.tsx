import { SinePlot } from './components/sine-plot';
import { UpdateNotification } from './components/update-notification';
import { useAppInfo } from './hooks/use-app-info';

export function App(): JSX.Element {
  const appInfo = useAppInfo();

  return (
    <main className="page">
      <UpdateNotification />
      <h1>Hello World Guy👋</h1>
      <p>Tauri + React + Plotly starter app. I cant believe this works.</p>
      {appInfo && (
        <p className="meta">
          {appInfo.appName} v{appInfo.appVersion} ({appInfo.platform})
        </p>
      )}
      <SinePlot />
    </main>
  );
}
