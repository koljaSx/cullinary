# ADR 0020: Show Decision Icons on the Image Preview

## Status

Accepted

## Context

Because marking an asset automatically advances to the next asset, the user needs quick visual confirmation that a decision was applied. When revisiting an already-marked asset, the app should also make the current decision obvious without requiring a sidebar scan.

## Decision

Show the asset's current decision as an icon overlay in the top-right corner of the image preview.

The icon remains visible for already-marked assets when the user navigates back to them. The first version treats the top-right image corner as the default right-corner placement.

## Consequences

Positive:

- Decision state is visible directly on the image.
- The overlay supports fast review without adding a large UI panel.
- Revisiting an image makes its current mark immediately clear.

Tradeoffs:

- The overlay must avoid hiding important image detail as much as possible.
- Icon and color choices need to remain legible across bright and dark photos.
- The UI needs accessible labels in addition to visual icons.

## Follow-Up Decisions

- Decide whether users can move or hide the overlay in a later version.
