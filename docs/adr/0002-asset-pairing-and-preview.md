# ADR 0002: RAW + JPEG Asset Pairing and JPEG-First Preview

## Status

Accepted

## Context

The app is intended for fast photo triage before importing selected images into Lightroom or an alternative RAW editor. Many camera workflows produce a RAW file plus a JPEG with the same basename. Loading or decoding RAW files during quick navigation would slow down the central review loop.

## Decision

Treat RAW + JPEG files with the same basename as one sortable asset.

During review, display the matching JPEG only. The user's decision applies to the entire asset group, so moving an asset later moves the RAW and JPEG together according to the chosen bucket.

## Consequences

Positive:

- Fast image-to-image navigation.
- Lower implementation risk for the first version because RAW decoding is not on the critical path.
- Decisions match the photographer's intent: the JPEG is a preview, while the RAW remains the source for later editing.

Tradeoffs:

- RAW-only folders need an explicit fallback decision.
- If the JPEG does not accurately represent the RAW edit potential, the app may hide recoverable detail during triage.
- Pairing rules must be deterministic and visible enough that users trust which files will move together.

## Follow-Up Decisions

- Whether extracted embedded RAW previews are allowed as a fallback.
- How to surface file grouping in the UI without slowing down the review flow.
