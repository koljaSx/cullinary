# ADR 0038: Supported Image Extensions for V1

## Status

Accepted

## Context

The scanner needs a deterministic allowlist of image extensions so grouping, preview generation, and move planning are predictable. Version one should support common RAW + JPEG workflows without attempting every camera format immediately.

## Decision

Version one supports these image extensions:

- `.jpg`
- `.jpeg`
- `.cr2`
- `.cr3`
- `.nef`
- `.arw`
- `.raf`
- `.rw2`
- `.orf`
- `.dng`

Extension matching should be case-insensitive.

## Consequences

Positive:

- Covers common Canon, Nikon, Sony, Fuji, Panasonic, Olympus, and DNG workflows.
- Keeps scanner behavior simple and testable.
- Makes unsupported-file behavior explicit.

Tradeoffs:

- Some RAW formats are not supported in v1.
- Users with unsupported camera files need a later extension update.

## Follow-Up Decisions

- Define unsupported-file messaging.
- Add more formats based on real user folders.

