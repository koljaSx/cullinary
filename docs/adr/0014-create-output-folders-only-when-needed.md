# ADR 0014: Create Output Folders Only When Needed

## Status

Accepted

## Context

The app creates decision folders under the selected main folder during finalization. Empty folders can make the user's shoot folder feel cluttered and may imply that a decision bucket contains files when it does not.

## Decision

Create `_reject`, `_keep`, and `_edit` only when at least one file will be moved into that folder.

## Consequences

Positive:

- Finished folders stay tidy.
- The presence of a bucket folder implies it contains reviewed files.
- The app avoids unnecessary filesystem writes.

Tradeoffs:

- Users cannot rely on all three folders existing after every review.
- Import workflows that expect fixed folders must handle missing empty buckets.

## Follow-Up Decisions

- Decide whether a later setting should always create all buckets.

