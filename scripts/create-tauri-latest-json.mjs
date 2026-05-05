import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [artifactDir, outputDir] = process.argv.slice(2);

if (!artifactDir || !outputDir) {
  console.error('Usage: node scripts/create-tauri-latest-json.mjs <artifact-dir> <output-dir>');
  process.exit(1);
}

const tagName = process.env.GITHUB_REF_NAME;
const repository = process.env.GITHUB_REPOSITORY;

if (!tagName || !repository) {
  console.error('GITHUB_REF_NAME and GITHUB_REPOSITORY must be set.');
  process.exit(1);
}

const files = await readdir(artifactDir);
const version = tagName.replace(/^v/, '');
const installerName = files.find(
  (file) => file.includes(`_${version}_`) && file.endsWith('-setup.exe')
);

if (!installerName) {
  console.error(`No NSIS setup executable for version ${version} found in ${artifactDir}.`);
  process.exit(1);
}

const signatureName = `${installerName}.sig`;

if (!files.includes(signatureName)) {
  console.error(`Missing updater signature next to installer: ${signatureName}`);
  process.exit(1);
}

const stagedInstallerName = `Tauri-React-Plotly_${version}_x64-setup.exe`;
const stagedSignatureName = `${stagedInstallerName}.sig`;
const signature = (await readFile(join(artifactDir, signatureName), 'utf8')).trim();
const assetUrl = `https://github.com/${repository}/releases/download/${tagName}/${stagedInstallerName}`;

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await copyFile(join(artifactDir, installerName), join(outputDir, stagedInstallerName));
await copyFile(join(artifactDir, signatureName), join(outputDir, stagedSignatureName));

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

await writeFile(join(outputDir, 'latest.json'), `${JSON.stringify(latestJson, null, 2)}\n`);

console.log(`Staged updater release assets in ${outputDir}:`);
console.log(`- ${stagedInstallerName}`);
console.log(`- ${stagedSignatureName}`);
console.log('- latest.json');
