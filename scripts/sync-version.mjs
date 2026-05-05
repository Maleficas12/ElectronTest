import { readFile, writeFile } from 'node:fs/promises';

const checkOnly = process.argv.includes('--check');
const packageJsonPath = 'package.json';
const tauriConfigPath = 'src-tauri/tauri.conf.json';
const cargoTomlPath = 'src-tauri/Cargo.toml';
const cargoLockPath = 'src-tauri/Cargo.lock';

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const appVersion = packageJson.version;

if (!appVersion) {
  console.error('package.json must define a version.');
  process.exit(1);
}

const plannedWrites = [];
const mismatches = [];

async function syncJsonVersion(path, label) {
  const source = await readFile(path, 'utf8');
  const data = JSON.parse(source);

  if (data.version === appVersion) {
    return;
  }

  mismatches.push(`${label}: ${data.version ?? '<missing>'} -> ${appVersion}`);
  data.version = appVersion;
  plannedWrites.push([path, `${JSON.stringify(data, null, 2)}\n`]);
}

async function syncCargoTomlVersion() {
  const source = await readFile(cargoTomlPath, 'utf8');
  const packageBlockPattern = /^(\[package\][\s\S]*?^version = ")([^"]+)(")/m;
  const match = source.match(packageBlockPattern);

  if (!match) {
    console.error(`Could not find [package] version in ${cargoTomlPath}.`);
    process.exit(1);
  }

  if (match[2] === appVersion) {
    return;
  }

  mismatches.push(`Cargo.toml: ${match[2]} -> ${appVersion}`);
  plannedWrites.push([cargoTomlPath, source.replace(packageBlockPattern, `$1${appVersion}$3`)]);
}

async function syncCargoLockVersion() {
  const source = await readFile(cargoLockPath, 'utf8');
  const packageBlockPattern = /(\[\[package\]\]\r?\nname = "electron-test"\r?\nversion = ")([^"]+)(")/;
  const match = source.match(packageBlockPattern);

  if (!match) {
    console.error(`Could not find electron-test package version in ${cargoLockPath}.`);
    process.exit(1);
  }

  if (match[2] === appVersion) {
    return;
  }

  mismatches.push(`Cargo.lock electron-test: ${match[2]} -> ${appVersion}`);
  plannedWrites.push([cargoLockPath, source.replace(packageBlockPattern, `$1${appVersion}$3`)]);
}

await syncJsonVersion(tauriConfigPath, 'tauri.conf.json');
await syncCargoTomlVersion();
await syncCargoLockVersion();

if (mismatches.length === 0) {
  console.log(`All app version mirrors match package.json version ${appVersion}.`);
  process.exit(0);
}

if (checkOnly) {
  console.error(`App version mirrors are out of sync with package.json version ${appVersion}:`);
  for (const mismatch of mismatches) {
    console.error(`- ${mismatch}`);
  }
  console.error('Run `npm run version:sync` to update mirrored versions.');
  process.exit(1);
}

for (const [path, contents] of plannedWrites) {
  await writeFile(path, contents);
}

console.log(`Synced app version mirrors to ${appVersion}:`);
for (const mismatch of mismatches) {
  console.log(`- ${mismatch}`);
}
