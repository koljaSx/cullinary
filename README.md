# Cullinary

Cullinary is a Electron app for quick RAW and JPEG triage before importing selected files into Lightroom or another RAW editor.

## Current Status

This is the first scaffold:

- Electron Forge app with TypeScript.
- React + Vite renderer.
- Strict main/preload/renderer boundary.
- Folder scanning and RAW/JPEG/XMP asset grouping.
- Autosaved session file support.
- Move-plan generation with conflict detection.
- Initial keyboard-driven review UI with filmstrip and metadata sidebar.

## Local Development

Use the bundled Node runtime or any local Node install that can run `pnpm`.

```sh
pnpm install
pnpm run start
```

## Verification

```sh
pnpm run check
pnpm run test
pnpm run package:local
```

`package:local` creates a local macOS app bundle and ad-hoc signs it. Signing is local-only and is not a substitute for future Developer ID signing or notarization.

## Notes

The managed Codex shell can build and package the app, but Electron GUI launch may abort under the Codex parent process. Launch the app from your normal Terminal or Finder when testing the UI locally.
