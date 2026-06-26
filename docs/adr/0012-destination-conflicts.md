# ADR 0012: Destination Conflicts Require User Resolution

## Status

Accepted

## Context

The app moves original photo files and sidecars into decision folders. A destination conflict can happen if a folder already contains a file with the same name, especially after repeated review sessions or manual folder edits.

## Decision

If a destination file already exists, flag the conflict in the move plan and require the user to decide how to resolve it.

The app must not overwrite silently and must not silently rename files. A conflicted file is moved only after the user approves the selected resolution.

## Consequences

Positive:

- Original files are protected from accidental overwrite.
- The user can inspect conflicts before any move happens.
- The final move plan remains explicit and auditable.

Tradeoffs:

- Finalization may require extra user interaction.
- The app needs a clear conflict-resolution UI.
- Batch moves may become partially blocked until conflicts are resolved.

## Follow-Up Decisions
