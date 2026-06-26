# ADR 0027: Metadata Sidebar Hidden by Default

## Status

Accepted

## Context

The main review UI should prioritize the image. Metadata can be useful, but always showing a sidebar would reduce the available preview area and make the first-run experience busier.

## Decision

The metadata sidebar is hidden by default in the first version.

Users can toggle it on when they want metadata.

## Consequences

Positive:

- The default review screen gives maximum space to the image.
- Metadata remains available without being visually dominant.
- The UI starts closer to a focused culling mode.

Tradeoffs:

- Users who frequently inspect metadata need to toggle the sidebar.
- Remembering sidebar visibility becomes a later preference decision.

## Follow-Up Decisions

- Decide whether sidebar visibility is remembered per user.

