# ADR 0039: Disable Hardware Acceleration in V1

## Status

Accepted

## Context

The local macOS package produced a native Electron crash report on macOS 26.5.1. The crash occurred inside `Electron Framework` on a Chromium worker thread rather than inside app JavaScript, React, IPC, or file-scanning code. The report also showed Apple Metal graphics components loaded.

Because version one is local-only and focused on validating the workflow, stability is more important than GPU-accelerated rendering.

## Decision

Disable Electron hardware acceleration in version one.

This should happen before the app is ready and before any browser windows are created.

## Consequences

Positive:

- Reduces exposure to native GPU/Metal rendering crashes during early local testing.
- Keeps the first version focused on product workflow rather than graphics tuning.
- Is easy to reverse once the app is stable and tested on more machines.

Tradeoffs:

- Large image rendering, zooming, and filmstrip scrolling may be less performant.
- Hardware acceleration should be revisited before heavier image-viewer work.

## Follow-Up Decisions

- Re-enable hardware acceleration after testing on the target macOS/Electron combination.
- Consider pinning to a more conservative Electron major if native crashes continue.

