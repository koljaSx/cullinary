# ADR 0028: Minimal V1 Metadata Sidebar

## Status

Accepted

## Context

The metadata sidebar exists to provide confidence about the current asset without expanding the first version into a full metadata browser. EXIF support is useful, but it is not required for the core sorting workflow.

## Decision

The first-version metadata sidebar shows only:

- Filename.
- Asset type, such as `RAW+JPEG`, `RAW`, or `JPEG`.
- Current decision.
- File list in the asset group.

EXIF metadata is deferred to a later version.

## Consequences

Positive:

- The first version stays focused on sorting.
- Users can still verify what files belong to the current asset.
- EXIF parsing and presentation can be designed later without blocking core review.

Tradeoffs:

- Exposure, lens, camera, rating, and capture metadata are not available in v1.
- Users who rely heavily on EXIF must use another tool until later versions.

## Follow-Up Decisions

- Design a future EXIF metadata panel.
- Decide whether EXIF parsing uses embedded metadata libraries, external tools, or both.

