# Agent Instructions

## Validation

- Before finishing new feature work, run `npm run typecheck` and `npm run test:smoke`.
- Before finishing version or release metadata changes, run `npm run version:check`.
- If either command cannot be run, say why in the final response and describe the remaining risk.
- Do not run installer builds for ordinary feature work unless the task changes packaging, signing, updater behavior, or release workflows.

## Versioning

- Treat `package.json` as the only human-edited app version.
- After changing `package.json` version, run `npm run version:sync`.
- Do not manually edit mirrored app versions in `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, or `src-tauri/Cargo.lock`.

## Testing

- Use Playwright smoke tests for browser-level validation.
- CI smoke tests use the system Chrome browser provided by the GitHub runner.
- Local machines may need a one-time `npx playwright install chromium`, unless running with `PLAYWRIGHT_CHANNEL=chrome`.
- Add or update tests in `tests/smoke` when changing visible renderer behavior.
- Keep smoke tests focused on stable user-visible behavior rather than implementation details.

## Release Secrets

- Never read, print, commit, or request updater private keys or passwords.
- The updater public key may live in `src-tauri/tauri.conf.json`.
- Signed installer builds are release-only and require GitHub secrets.
