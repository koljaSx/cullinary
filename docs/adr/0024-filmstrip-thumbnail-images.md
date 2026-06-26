# ADR 0024: Filmstrip Items Show Thumbnail Images

## Status

Accepted

## Context

The filmstrip exists to provide visual orientation across the whole review session. Its primary value is quick visual recognition of nearby and distant assets.

## Decision

Each filmstrip item shows the asset's thumbnail image.

The first version keeps this decision focused on the base thumbnail content. Decision overlays, current-image selection state, and metadata labels are separate follow-up decisions.

## Consequences

Positive:

- The filmstrip remains visually useful and Lightroom-like.
- Users can recognize images without reading filenames.
- Thumbnail generation becomes a first-class performance concern.

Tradeoffs:

- Thumbnail loading and caching must be reliable for large folders.
- Without additional overlays, thumbnails alone do not communicate all review state.

## Follow-Up Decisions

- Decide whether filenames or counters ever appear in the filmstrip.
