# ADR 0005: Scan Only the Selected Folder

## Status

Accepted

## Context

The app starts from a user-selected folder and later moves reviewed files into sort buckets under that folder. Including subfolders by default would increase the chance of surprising move operations, especially when imported photo directories already contain nested structures.

## Decision

The first version scans only the selected folder. It does not recurse into subfolders.

Output folders created by the app are also ignored during scanning so previous sorting results are not pulled back into a new review session.

## Consequences

Positive:

- Easier to understand which files are in the review session.
- Safer final move operation.
- Simpler file grouping and conflict handling.
- Faster initial scan for large photo libraries.

Tradeoffs:

- Users with nested shoot folders must review each folder separately.
- A later recursive mode would need clear UX and stronger move-plan safeguards.

## Follow-Up Decisions

- Define the generated output folder names that scanning must ignore.
- Decide whether a later version offers an explicit include-subfolders option.

