# ADR 0011: First-Version Output Folder Names

## Status

Accepted

## Context

After review, the app moves assets into folders under the selected main folder. These folder names will be visible in the filesystem and in later Lightroom or alternative editor import workflows.

## Decision

Use these first-version output folders:

- `_reject` for unusable assets.
- `_keep` for assets worth keeping.
- `_edit` for assets worth keeping and editing properly.

## Consequences

Positive:

- Short, predictable names.
- Leading underscores keep generated folders visually grouped.
- Folder names map directly to the three review decisions.

Tradeoffs:

- The names are English-only.
- `_edit` may be slightly RAW-centric for JPEG-only assets, but still communicates the intended workflow.

## Follow-Up Decisions

- Decide whether folder names become configurable in a later version.
