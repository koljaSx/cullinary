# ADR 0025: Filmstrip Shows Decision and Current-Image State

## Status

Accepted

## Context

The filmstrip shows thumbnail images for the whole review session. To support fast navigation and review awareness, users need to see which nearby images are already marked and which thumbnail corresponds to the main preview.

## Decision

Show decision state and current-image state on filmstrip thumbnails:

- Marked thumbnails show the same decision icon language as the main preview.
- The currently displayed asset has a thin selection outline.
- Filenames are not shown in the filmstrip by default.

## Consequences

Positive:

- Users can see review progress without leaving the main image.
- Current position is obvious in the filmstrip.
- The strip stays compact because filenames are omitted.

Tradeoffs:

- Icons must remain readable at thumbnail size.
- Filename lookup needs to live elsewhere in the UI.

## Follow-Up Decisions

- Verify thumbnail icon contrast and hit targets during implementation.
