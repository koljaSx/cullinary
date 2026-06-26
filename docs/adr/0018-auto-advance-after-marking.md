# ADR 0018: Auto-Advance After Marking

## Status

Accepted

## Context

The app's review flow is optimized for fast triage. Requiring a separate navigation keystroke after every decision would slow down large shoots.

## Decision

When the user presses `X`, `P`, or `E`, the app applies the decision to the current asset and automatically advances to the next asset.

Users can still navigate backward and forward with the arrow keys to revisit and change decisions.

## Consequences

Positive:

- One keystroke per image is possible during fast review.
- The interaction supports Lightroom-like culling speed.
- Corrections remain possible through navigation.

Tradeoffs:

- Users who want to pause after every mark may need to navigate back.
- The app needs clear visual feedback that the decision was saved before advancing.

## Follow-Up Decisions

- Decide whether auto-advance can be disabled in a later preference.
