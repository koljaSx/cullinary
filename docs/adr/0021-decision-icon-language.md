# ADR 0021: Decision Icon Language

## Status

Accepted

## Context

Decision icons need to be readable at a glance on top of varied image content. The icons should map clearly to the three sorting decisions without requiring text in the main review flow.

## Decision

Use this first-version decision icon language:

- `reject`: red `X`.
- `keep`: green checkmark.
- `edit`: amber pencil or sliders icon.

## Consequences

Positive:

- The three decisions are visually distinct.
- The red/green mapping is familiar for reject/keep.
- Amber distinguishes edit intent from plain keep without making it feel destructive.

Tradeoffs:

- Color alone is not accessible, so icons need accessible labels and sufficient contrast.
- The exact edit icon may depend on the chosen icon library.

## Follow-Up Decisions

- Choose the exact icon set during implementation.
- Verify icon contrast on bright and dark images.

