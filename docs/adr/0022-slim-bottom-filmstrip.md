# ADR 0022: Include a Slim Bottom Filmstrip

## Status

Accepted

## Context

The main review experience should stay focused on one large image at a time. A Lightroom-like filmstrip can provide orientation, nearby navigation, and progress context without turning the first version into a full asset-management grid.

## Decision

Include a slim bottom filmstrip in the first version.

The first version does not include a full grid view. The filmstrip supports review context and nearby navigation while the main image remains the dominant UI surface.

## Consequences

Positive:

- Users can see where they are in the shoot.
- Nearby navigation is easier than arrow-only movement.
- Decision state can be visible across adjacent images.
- The app feels closer to Lightroom without taking on a full library browser.

Tradeoffs:

- Thumbnail generation and virtualization need care for large folders.
- The filmstrip consumes vertical space that could otherwise show the image.
- A full grid selection workflow is deferred.

## Follow-Up Decisions

- Decide whether a full grid view is a later version feature.
