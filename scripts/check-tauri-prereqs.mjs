import { spawnSync } from 'node:child_process';

function assertTool(name, checkArgs, installHint) {
  const result = spawnSync(name, checkArgs, { stdio: 'ignore', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    console.error(`\n[tauri prerequisite missing] '${name}' was not found.`);
    console.error(installHint);
    process.exit(1);
  }
}

assertTool(
  'cargo',
  ['--version'],
  'Install Rust/Cargo: https://www.rust-lang.org/tools/install\nThen restart VS Code and run: npm run dev'
);

assertTool(
  'rustc',
  ['--version'],
  "Rust compiler ('rustc') is required for Tauri desktop builds. Install/update via rustup, then restart your terminal."
);
