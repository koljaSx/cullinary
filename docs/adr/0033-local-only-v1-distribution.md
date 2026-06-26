# ADR 0033: Local-Only Distribution for V1

## Status

Accepted

## Context

The first version should prove the review, decision, preview, and safe file-move workflow. macOS signing, notarization, shareable installers, and auto-update add release complexity that is not needed for a local development build.

## Decision

Version one distribution is local-only.

Signed and notarized macOS builds, shareable installers, and auto-update are deferred until the app is ready to be used beyond the development machine.

Local macOS package builds may be ad-hoc signed so they can run on the development machine. This is not a shareable distribution strategy.

## Consequences

Positive:

- Core workflow development is not blocked by release infrastructure.
- Packaging choices can be revisited after the app shape is clearer.
- Local testing can move faster.

Tradeoffs:

- Version one is not suitable for broad sharing.
- macOS security prompts and local launch behavior may differ from a final signed app.

## Follow-Up Decisions

- Define the macOS signing and notarization approach for the first shareable build.
- Decide whether the app needs auto-update.
- Decide the release channel model after local validation.
