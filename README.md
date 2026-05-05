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

## Configure app updates

The app uses Tauri's updater plugin and checks this public release asset on startup:

```text
https://github.com/Maleficas12/ElectronTest/releases/latest/download/latest.json
```

An updater keypair has been generated locally under `.tauri/`, which is ignored by git. To generate a fresh keypair instead:

```bash
npx tauri signer generate -w .tauri/electron-test.key -p "<password>" --ci --force
```

Then:
- Keep the public key in `src-tauri/tauri.conf.json`.
- Add the private key content from `.tauri/electron-test.key` as the GitHub Actions secret `TAURI_SIGNING_PRIVATE_KEY`.
- Add the password from `.tauri/electron-test.key.password` as the GitHub Actions secret `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.

The `main` CI build uploads the signed NSIS installer and `.sig`; the tag promotion workflow publishes those files plus `latest.json` to GitHub Releases.
