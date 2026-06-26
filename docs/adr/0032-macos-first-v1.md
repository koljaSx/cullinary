# ADR 0032: Target macOS First for V1

## Status

Accepted

## Context

Electron can support multiple desktop platforms, but packaging, filesystem permissions, app signing, notarization, native dependencies, and RAW preview tooling all add platform-specific complexity. The first version should focus on proving the review and sorting workflow.

## Decision

Version one targets macOS first.

The architecture should remain portable where practical, but Windows and Linux packaging are deferred until after the macOS-first workflow is working well.

## Consequences

Positive:

- Reduces first-version packaging and release complexity.
- Lets development focus on fast review, file grouping, and safe move behavior.
- Keeps macOS file permission and signing decisions explicit.

Tradeoffs:

- Windows and Linux users are not first-version targets.
- Some implementation choices may need later adjustment for cross-platform packaging.

## Follow-Up Decisions

- Revisit Windows and Linux packaging after the macOS-first app is usable.

