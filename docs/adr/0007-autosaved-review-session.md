# ADR 0007: Autosave Review Sessions

## Status

Accepted

## Context

Photo review sessions can involve hundreds or thousands of files. Losing decisions after an app close, crash, or laptop sleep would make the tool frustrating and risky to use.

## Decision

Autosave the review session after each decision.

The first version stores a small JSON file named `_cullinary-session.json` under the selected folder. It records the asset list, decisions, active position, and enough file metadata to detect likely changes between app runs.

## Consequences

Positive:

- Users can resume unfinished review sessions.
- App crashes or accidental closes do not discard triage work.
- The final move plan can be rebuilt from saved decisions.

Tradeoffs:

- The app writes one metadata file into the selected folder.
- The app needs recovery UX for changed, missing, or already-moved files.
- Session cleanup after successful completion needs a separate decision.

## Follow-Up Decisions

- Define the exact session file schema.
- Define validation rules for changed file paths, sizes, and modification times.
