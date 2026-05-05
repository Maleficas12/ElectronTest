import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const [artifactDir, outputPath] = process.argv.slice(2);

if (!artifactDir || !outputPath) {
  console.error('Usage: node scripts/create-tauri-latest-json.mjs <artifact-dir> <output-path>');
  process.exit(1);
}

const tagName = process.env.GITHUB_REF_NAME;
const repository = process.env.GITHUB_REPOSITORY;

if (!tagName || !repository) {
  console.error('GITHUB_REF_NAME and GITHUB_REPOSITORY must be set.');
  process.exit(1);
}

const files = await readdir(artifactDir);
const installerName = files.find((file) => file.endsWith('-setup.exe'));

if (!installerName) {
  console.error(`No NSIS setup executable found in ${artifactDir}.`);
  process.exit(1);
}

const signatureName = `${installerName}.sig`;

if (!files.includes(signatureName)) {
  console.error(`Missing updater signature next to installer: ${signatureName}`);
  process.exit(1);
}

const version = tagName.replace(/^v/, '');
const signature = (await readFile(join(artifactDir, signatureName), 'utf8')).trim();
const assetUrl = `https://github.com/${repository}/releases/download/${tagName}/${encodeURIComponent(
  basename(installerName)
)}`;

const latestJson = {
  version,
  notes: `Release ${tagName}`,
  pub_date: new Date().toISOString(),
  platforms: {
    'windows-x86_64': {
      signature,
      url: assetUrl
    }
  }
};

await writeFile(outputPath, `${JSON.stringify(latestJson, null, 2)}\n`);
