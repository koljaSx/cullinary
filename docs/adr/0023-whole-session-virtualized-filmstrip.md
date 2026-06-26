# ADR 0023: Whole-Session Virtualized Filmstrip

## Status

Accepted

## Context

The bottom filmstrip should help the user understand and navigate the entire review session, not just the current image and its immediate neighbors. At the same time, photo folders can contain hundreds or thousands of images, so loading every thumbnail at once would hurt startup and review performance.

## Decision

The filmstrip represents the whole review session.

It must be virtualized: the UI should render and load only the visible thumbnail range plus a small buffer, while preserving the ability to scroll or jump across the whole session.

## Consequences

Positive:

- Users can navigate across the entire selected folder from the filmstrip.
- Large folders remain practical because thumbnail work is bounded.
- The filmstrip can double as a progress overview without becoming a full grid view.

Tradeoffs:

- The implementation needs thumbnail virtualization and cache-aware loading.
- Scroll position, current asset visibility, and keyboard navigation need careful coordination.

## Follow-Up Decisions

- Define thumbnail preloading and cache behavior.
