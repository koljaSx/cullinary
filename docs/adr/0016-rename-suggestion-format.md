# ADR 0016: Rename Conflict Suggestions Use Copy Suffixes

## Status

Accepted

## Context

When a destination conflict is resolved by renaming, the app should propose a deterministic name that is readable, avoids overwriting, and keeps grouped RAW/JPEG/sidecar files aligned.

## Decision

Suggest renames by appending `-copy-XX` to the shared basename and preserving each file extension.

For a grouped asset, every file in the group receives the same basename suffix. Example:

- `IMG_1234.CR3` becomes `IMG_1234-copy-02.CR3`.
- `IMG_1234.JPG` becomes `IMG_1234-copy-02.JPG`.
- `IMG_1234.XMP` becomes `IMG_1234-copy-02.XMP`.

The numeric suffix increments until all proposed destination names are available.

## Consequences

Positive:

- Renames are predictable and easy to read.
- Grouped files remain visibly connected by basename.
- The app can generate a safe default while still requiring user approval.

Tradeoffs:

- The suffix is English-centric.
- Very heavily conflicted folders can produce larger suffix numbers.

## Follow-Up Decisions

- Decide whether users can edit the suggested basename manually in v1.

