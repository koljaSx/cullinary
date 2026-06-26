# ADR 0008: Embedded-Preview-First RAW Display

## Status

Accepted

## Context

RAW-only assets must remain reviewable, but the central interaction of the app is fast image-to-image triage. Full RAW decoding can be slower than reading a JPEG or embedded preview and should not block keyboard-driven navigation.

## Decision

For RAW-only assets, extract and display the embedded RAW preview first.

If no usable embedded preview exists, fall back to full RAW decoding. Full decoding should happen off the renderer's critical path and should be cached once generated.

## Consequences

Positive:

- RAW-only files remain supported without making every review step expensive.
- Most cameras provide embedded previews that are good enough for triage.
- The app can keep a Lightroom-like quick review feel even in mixed folders.

Tradeoffs:

- Embedded previews may not reflect full RAW dynamic range or final edit potential.
- The app needs robust error states for missing, corrupt, or unsupported previews.
- A RAW processing dependency is still needed for extraction and fallback decoding.

## Follow-Up Decisions

- Define preview cache invalidation details.
- Define UI states for loading, unsupported RAW files, and preview extraction failure.
