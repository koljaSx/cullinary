# ADR 0031: Delete Session File After Fully Successful Finalization

## Status

Accepted

## Context

The app autosaves review state to `_cullinary-session.json` under the selected folder. Once a session is fully finalized and all planned moves succeed, the recovery file is no longer needed. If finalization is partial or blocked, the session file remains valuable recovery state.

## Decision

Delete `_cullinary-session.json` after a fully successful final move.

Keep `_cullinary-session.json` if finalization is partial, blocked, skipped, conflicted, or otherwise incomplete.

## Consequences

Positive:

- Completed folders are not left with stale session files.
- Recovery state remains available when work is unfinished.
- The cleanup rule is easy to explain.

Tradeoffs:

- Users who wanted a historical record of decisions will not have one after success.
- The app must distinguish fully successful finalization from partial completion accurately.

## Follow-Up Decisions

- Define finalization success criteria precisely.
- Decide whether a future version exports a review report before deleting the session file.
