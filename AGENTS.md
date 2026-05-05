# Agent Instructions

## Validation

- Before finishing new feature work, run `npm run typecheck` and `npm run test:smoke`.
- If either command cannot be run, say why in the final response and describe the remaining risk.
- Do not run installer builds for ordinary feature work unless the task changes packaging, signing, updater behavior, or release workflows.

## Testing

- Use Playwright smoke tests for browser-level validation.
- Add or update tests in `tests/smoke` when changing visible renderer behavior.
- Keep smoke tests focused on stable user-visible behavior rather than implementation details.

## Release Secrets

- Never read, print, commit, or request updater private keys or passwords.
- The updater public key may live in `src-tauri/tauri.conf.json`.
- Signed installer builds are release-only and require GitHub secrets.
