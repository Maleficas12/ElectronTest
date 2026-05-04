# Tauri + React + Plotly (Windows Build Ready)

A scalable starter app with:
- Tauri (Rust backend + secure command bridge)
- React (renderer UI)
- Plotly.js for chart rendering
- Tauri bundling for standalone desktop installers/executables

## Project structure

- `src-tauri`: Tauri backend (commands, lifecycle, bundling config)
- `src/shared`: Shared frontend/backend data contracts
- `src/renderer`: React UI, hooks, services, and components

## Run in development (IDE friendly)

```bash
npm install
npm run dev
```

This starts Vite and launches the Tauri app pointing at your local dev server.

## Build frontend assets

```bash
npm run build
```

## Build a standalone desktop app (.exe on Windows)

```bash
npm run build:app
```

On Windows, Tauri will generate a standalone executable/installer in `src-tauri/target/release/bundle`.
