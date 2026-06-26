# ADR 0019: Space Toggles Fit and 100% Loupe

## Status

Accepted

## Context

Fast photo triage often requires checking sharpness quickly. The user should be able to inspect detail without switching modes or interrupting keyboard-driven review.

## Decision

Pressing `Space` toggles the image preview between fit-to-view and 100% loupe/zoom.

When possible, the 100% view centers on the current cursor position. If no cursor position is available, it centers on the image.

## Consequences

Positive:

- Quick sharpness checks stay in the main review flow.
- The interaction is easy to reach with one hand near the decision keys.
- Fit-to-view remains the default overview state.

Tradeoffs:

- The image viewer needs reliable zoom anchoring and pan behavior.
- Keyboard focus must ensure `Space` does not accidentally trigger buttons while reviewing.

## Follow-Up Decisions

- Define panning behavior while zoomed.
- Decide whether mouse wheel or trackpad pinch zoom is supported in v1.

