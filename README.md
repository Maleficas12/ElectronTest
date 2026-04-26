# Electron + React + Plotly (Windows Build Ready)

A simple, scalable starter app with:
- Electron (main/preload process)
- React (renderer UI)
- Plotly.js for chart rendering
- electron-builder (Windows installer target)
- electron-updater wiring ready for future GitHub Releases workflow

## Project structure

- `src/main`: Electron main process (window lifecycle, IPC, updater wiring)
- `src/preload`: Safe bridge exposed to renderer
- `src/shared`: Shared contracts/channels between layers
- `src/renderer`: React UI, hooks, services, and components

## Run in development

```bash
npm install
npm run dev
```

## Build app

```bash
npm run build
```

## Create a Windows executable installer

```bash
npm run dist:win
```

> Note: For publishing/updater later, update the `build.publish` owner/repo fields in `package.json`.
