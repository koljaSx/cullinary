# ADR 0010: JPEG-Only Assets Are Sortable

## Status

Accepted

## Context

Selected folders may contain JPEG files without matching RAW files. This can happen with phone photos, JPEG-only camera settings, exported selects, screenshots, or mixed working folders.

## Decision

Include JPEG-only files as sortable assets.

When a JPEG file has no matching RAW file, the app displays the JPEG and applies the user's decision to that JPEG asset only. During finalization, the JPEG moves by itself unless it has recognized sidecars.

## Consequences

Positive:

- Mixed folders behave predictably.
- The app is useful beyond strict RAW+JPEG camera workflows.
- The domain rule is simple: every supported photo becomes an asset, with grouping where matching files exist.

Tradeoffs:

- The move preview must make it clear whether an asset includes RAW, JPEG, both, or sidecars.
- JPEG-only files marked `edit` may need wording that still makes sense when there is no RAW file to edit.

## Follow-Up Decisions

- Define UI indicators for RAW+JPEG, RAW-only, and JPEG-only assets.
- Confirm whether the `edit` bucket name should remain `_edit` for JPEG-only assets.

