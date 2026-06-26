# ADR 0030: Recognize XMP Sidecars Only in V1

## Status

Accepted

## Context

Sidecar grouping keeps metadata and edit files attached to image assets. A broad allowlist could accidentally group unrelated files that share a basename, while `.xmp` is the most important first-version sidecar for Lightroom and Adobe Camera Raw workflows.

## Decision

Version one recognizes `.xmp` as the only sidecar extension.

If an `.xmp` file shares a basename with a supported image asset in the selected folder, it is grouped with that asset and moves with it.

## Consequences

Positive:

- Supports the most important Lightroom-style sidecar workflow.
- Reduces accidental grouping risk.
- Keeps first-version file grouping simple and predictable.

Tradeoffs:

- Other sidecar formats are ignored in v1.
- Users with non-XMP metadata sidecars may need to move those files manually.

## Follow-Up Decisions

- Decide which additional sidecar formats to support later.
- Decide whether unknown same-basename files should produce warnings.

