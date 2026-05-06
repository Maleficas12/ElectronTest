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

Generate the updater signing keypair yourself and keep the private key/password private. Only the public key belongs in `src-tauri/tauri.conf.json`.

```powershell
npx tauri signer generate -w "$env:USERPROFILE\.tauri\tauri-react-plotly.key"
```

Then:
- Copy the generated public key into `src-tauri/tauri.conf.json`.
- Add the full private key file contents as the GitHub Actions secret `TAURI_SIGNING_PRIVATE_KEY`.
- Add the password you typed during key generation as `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.
- Never commit or paste the private key/password into chat, PR comments, logs, or docs.

Pull requests and pushes to `main` run fast app validation only: version mirror checks, TypeScript typechecking, and Playwright smoke tests. Signed Windows installers are built only by the tag release workflow.

To publish a release:
- Update `package.json` version and run `npm run version:sync`.
- Merge the change to `main`.
- Create and push a matching tag such as `v0.1.4`.

The release workflow checks that the tag is reachable from `main`, verifies the tag matches `package.json`, reruns validation, builds the signed NSIS installer with updater artifacts, stages the installer as a stable hyphenated release asset, generates `latest.json`, and uploads the installer, `.sig`, and metadata to GitHub Releases.
