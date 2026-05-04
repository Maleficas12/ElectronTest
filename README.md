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

## Run in development (VS Code friendly)

### 1) Install prerequisites (Windows)

- Node.js LTS
- Rust toolchain (includes `cargo` and `rustc`): https://www.rust-lang.org/tools/install
- Microsoft Visual C++ Build Tools (Desktop development with C++)
- WebView2 Runtime (typically already installed on Windows 10/11)

> If `npm run dev` reports `cargo metadata ... program not found`, Rust/Cargo is not installed or not available on your PATH. Restart VS Code after installing Rust.

### 2) Start desktop development mode

```bash
npm install
npm run dev
```

This starts Vite and launches the Tauri desktop app.

If you only want the web UI while setting up Rust, run:

```bash
npm run dev:web
```

## Build frontend assets

```bash
npm run build
```

## Build a standalone desktop app (.exe on Windows)

```bash
npm run build:app
```

On Windows, Tauri will generate a standalone executable/installer in `src-tauri/target/release/bundle`.
