import { useUpdater } from '../hooks/use-updater';

function formatBytes(value: number): string {
  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function UpdateNotification(): JSX.Element | null {
  const { status, update, progress, error, errorTitle, install, dismiss } = useUpdater();

  if (status === 'checking') {
    return <aside className="update-banner">Checking for updates...</aside>;
  }

  if (status === 'available' && update) {
    return (
      <aside className="update-banner update-banner--available">
        <div>
          <strong>Update available: v{update.version}</strong>
          {update.body && <p>{update.body}</p>}
        </div>
        <div className="update-actions">
          <button type="button" className="button button--primary" onClick={() => void install()}>
            Install update
          </button>
          <button type="button" className="button" onClick={dismiss}>
            Later
          </button>
        </div>
      </aside>
    );
  }

  if (status === 'installing') {
    const downloaded = progress?.downloadedBytes ?? 0;
    const total = progress?.contentLength;
    const percent = total ? Math.min(100, Math.round((downloaded / total) * 100)) : null;

    return (
      <aside className="update-banner update-banner--available">
        <div>
          <strong>Installing update...</strong>
          <p>
            {percent !== null && total !== undefined
              ? `${percent}% downloaded (${formatBytes(downloaded)} of ${formatBytes(total)})`
              : `${formatBytes(downloaded)} downloaded`}
          </p>
        </div>
        {percent !== null && (
          <div className="progress-track" aria-label="Update download progress">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        )}
      </aside>
    );
  }

  if (status === 'error' && error) {
    return (
      <aside className="update-banner update-banner--error">
        <div>
          <strong>{errorTitle ?? 'Update failed'}</strong>
          <p>{error}</p>
        </div>
        <button type="button" className="button" onClick={dismiss}>
          Dismiss
        </button>
      </aside>
    );
  }

  return null;
}
