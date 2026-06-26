# ADR 0017: First-Version Keyboard Controls

## Status

Accepted

## Context

The app is intended for fast, Lightroom-like photo triage. Keyboard controls should support rapid review without forcing the user to reach for the mouse for each decision.

## Decision

Use these first-version keyboard controls:

- `X`: mark the current asset as `reject`.
- `P`: mark the current asset as `keep`.
- `E`: mark the current asset as `edit`.
- `Left Arrow`: move to the previous asset.
- `Right Arrow`: move to the next asset.
- `Space`: toggle between fit-to-view and 100% loupe/zoom preview.

## Consequences

Positive:

- `X` and `P` align with common Lightroom-style reject/pick muscle memory.
- `E` is explicit for the app's edit bucket.
- Arrow navigation is familiar and discoverable.

Tradeoffs:

- `E` is app-specific rather than a Lightroom default.
- Shortcut customization is deferred.
- `Space` supports quick sharpness checks without leaving the review flow.

## Follow-Up Decisions

- Decide whether shortcuts are configurable in a later version.
