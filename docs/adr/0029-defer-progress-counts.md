# ADR 0029: Defer Progress Counts From V1

## Status

Accepted

## Context

Progress counts can help users understand review status and decision distribution. Examples include current position, total assets, reject count, keep count, edit count, and unmarked count.

## Decision

Do not include progress counts in version one.

Keep the idea in roadmap notes for a later version.

## Consequences

Positive:

- The first-version review UI stays minimal.
- Implementation can focus on core review, decision, and move workflows.
- Progress counts can be designed later with real usage feedback.

Tradeoffs:

- Users have less numeric visibility into review progress in v1.
- Session completion relies more on navigation/end-state cues than count summaries.

## Follow-Up Decisions

- Design future progress count placement and styling.
- Decide whether future counts are always visible or optional.

