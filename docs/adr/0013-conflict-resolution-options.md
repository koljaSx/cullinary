# ADR 0013: First-Version Conflict Resolution Options

## Status

Accepted

## Context

Destination conflicts require user resolution before files move. The first version should provide enough control to finish a session without introducing destructive choices that can damage original files.

## Decision

Offer two conflict resolution choices in the first version:

- `skip`: leave the conflicted source file in place.
- `rename`: move the file using a user-approved non-conflicting destination name.

Do not offer `replace` in the first version.

## Consequences

Positive:

- No first-version flow overwrites an existing photo file.
- The user can still complete a move by approving a safe rename.
- The conflict UI remains focused.

Tradeoffs:

- Users who intentionally want to replace files must resolve that manually outside the app.
- Grouped assets need clear behavior if one file is skipped and another is renamed.

## Follow-Up Decisions
