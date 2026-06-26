# ADR 0001: Electron Application Foundation

## Status

Proposed

## Context

The app is a local-first desktop tool for quickly reviewing RAW + JPEG photo folders. It needs native filesystem access, fast keyboard-driven UI, image preview performance, and a careful security boundary between the UI and filesystem operations.

As of 2026-06-24, the Electron releases page lists Electron `42.5.0` as the latest stable release, published 2026-06-23. Electron's current security guidance emphasizes using a current Electron release, keeping Node.js out of renderers, enabling context isolation, using process sandboxing, defining a Content Security Policy, validating IPC senders, and preferring custom protocols over direct `file://` loading where appropriate.

Sources:

- [Electron releases](https://releases.electronjs.org/)
- [Electron security tutorial](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Electron Forge Vite + TypeScript template](https://www.electronforge.io/templates/vite-+-typescript)

## Decision

Start with a modern Electron + TypeScript + React foundation:

- Electron on the latest stable major supported at project creation.
- TypeScript for main, preload, and renderer code.
- React for the renderer UI.
- A strict main/preload/renderer boundary.
- `contextIsolation: true`, renderer sandboxing, and no renderer `nodeIntegration`.
- Filesystem, folder scanning, and file move operations live in the main process or a utility process.
- The renderer receives only typed, purpose-specific APIs exposed through preload.
- The app uses a restrictive CSP and avoids loading remote code.
- Image file paths are resolved through app-controlled APIs rather than giving the renderer broad disk access.

For tooling, use Electron Forge with React, Vite, and TypeScript. Since v1 is local-only, the faster development loop is more valuable than conservative packaging defaults.

## Consequences

Positive:

- Stronger security posture for a filesystem-capable desktop app.
- Clear separation between UI state and privileged file operations.
- Good fit for keyboard-heavy, Lightroom-like interactions.
- TypeScript gives useful safety around file grouping, move plans, and IPC contracts.
- React matches the developer's existing frontend familiarity.
- Vite gives a fast renderer development loop.
- Electron Forge gives the app a conventional Electron scaffold and package path.

Tradeoffs:

- More upfront structure than a quick single-process prototype.
- Image preview performance may require dedicated workers, utility processes, or native libraries after measurement.
- RAW support needs a separate decision: decode RAW directly, display matching JPEGs, extract embedded previews, or combine these strategies.
- Shareable packaging hardening is still deferred.

## Follow-Up Decisions

- macOS packaging, signing, notarization, and auto-update expectations.
