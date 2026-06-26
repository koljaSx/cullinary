# ADR 0037: Use ExifTool First for RAW-Only Previews

## Status

Accepted

## Context

RAW-only assets need to be displayable, but the first version should preserve a fast review loop and avoid unnecessary native dependency complexity. The accepted preview strategy is embedded-preview-first, with full RAW decoding only as fallback.

ExifTool supports reading RAW formats and extracting embedded image data such as `PreviewImage` and `JpgFromRaw`. LibRaw provides RAW reading, embedded preview extraction, and basic conversion, but deeper integration is more complex and should wait until needed.

Sources:

- [ExifTool application documentation](https://exiftool.org/exiftool_pod.html)
- [ExifTool extra tags](https://exiftool.org/TagNames/Extra.html)
- [LibRaw overview](https://www.libraw.org/about)

## Decision

Use ExifTool first for RAW-only preview support in version one.

The app extracts embedded RAW previews through ExifTool and caches the generated display preview in the app cache. Full RAW decoding through LibRaw or another RAW decoder is deferred until embedded preview extraction proves insufficient.

## Consequences

Positive:

- Matches the embedded-preview-first performance strategy.
- Avoids adding a heavier native RAW decoder in the first version.
- Keeps RAW-only assets reviewable for local development.

Tradeoffs:

- RAW files without usable embedded previews may need a clear unsupported/loading-failed state in v1.
- ExifTool process management becomes part of the preview service.
- Full RAW decoding remains unsolved until a later version.

## Follow-Up Decisions

- Define unsupported and failed-preview UI states.
- Decide whether LibRaw is needed after testing real folders.

