# ADR 0015: Resolve Conflicts at the Asset Group Level

## Status

Accepted

## Context

An `ImageAsset` can include a RAW file, JPEG preview, and sidecar files. If one file in the group conflicts at its destination, resolving that conflict independently could separate files that should stay together.

## Decision

Apply conflict resolution to the whole asset group.

If any file in an asset group conflicts, the asset is treated as conflicted until the user chooses a coherent group-level resolution. For example, a `skip` resolution leaves the whole asset group unmoved; a `rename` resolution uses a consistent rename strategy for the grouped files.

## Consequences

Positive:

- RAW, JPEG, and sidecars stay together.
- Conflict handling matches the one-decision-per-asset mental model.
- Move execution can avoid partial grouping mistakes.

Tradeoffs:

- A conflict in one sidecar can block the entire asset group.
- The UI must explain which specific file caused the group-level conflict.

## Follow-Up Decisions

- Decide whether advanced per-file conflict handling is ever exposed in a later version.
