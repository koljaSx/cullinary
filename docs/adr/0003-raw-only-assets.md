# ADR 0003: RAW-Only Assets Stay Reviewable

## Status

Accepted

## Context

The fastest review path uses camera-created JPEG files when a RAW + JPEG pair exists. Some folders may still contain RAW files without matching JPEGs, and hiding those files would make the sorter incomplete and potentially surprising.

## Decision

Include RAW files without matching JPEGs in the review session.

When no JPEG exists, the app shows the RAW file through a RAW preview fallback.

## Consequences

Positive:

- The app can handle mixed folders without silently omitting source images.
- Users can make decisions on every supported image file in the selected folder.
- The model remains simple: every supported photo becomes an `ImageAsset`.

Tradeoffs:

- RAW-only navigation may be slower than JPEG-backed navigation.
- The app needs clear loading and error states for unsupported or damaged RAW files.
- Preview generation and caching become important for perceived performance.

## Follow-Up Decisions

- Define loading, failure, and unsupported-file states.
