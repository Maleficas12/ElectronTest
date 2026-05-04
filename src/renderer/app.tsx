import { SinePlot } from './components/sine-plot';
import { useAppInfo } from './hooks/use-app-info';

export function App(): JSX.Element {
  const appInfo = useAppInfo();

  return (
    <main className="page">
      <h1>Hello World 👋</h1>
      <p>Tauri + React + Plotly starter app.</p>
      {appInfo && (
        <p className="meta">
          {appInfo.appName} v{appInfo.appVersion} ({appInfo.platform})
        </p>
      )}
      <SinePlot />
    </main>
  );
}
