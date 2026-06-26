# ADR 0006: Move Rejected Assets to a Reject Folder

## Status

Accepted

## Context

The app's `reject` decision means the user considers an image unusable during triage. Because the app deals with original photo files and grouped sidecars, destructive behavior would be risky and hard to recover from.

## Decision

Move rejected assets to an `_reject` folder under the selected main folder.

The app does not delete rejected files and does not send them to the OS trash.

## Consequences

Positive:

- Reject decisions remain reversible outside the app.
- Users can inspect rejected files before deleting or archiving them.
- The move model remains consistent with `keep` and `edit` buckets.

Tradeoffs:

- Rejected files still consume disk space.
- Users need a separate cleanup step if they want to delete rejects permanently.

## Follow-Up Decisions
