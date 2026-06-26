# ADR 0004: Move Sidecars With Their Asset

## Status

Accepted

## Context

Photo folders often contain files that belong to an image but are not themselves the display preview or RAW source. Common examples include `.xmp` metadata files created by Lightroom, Adobe Camera Raw, or other editors. Separating these files from their matching RAW/JPEG asset can lose ratings, edit metadata, labels, or other workflow information.

## Decision

Move recognized sidecar files automatically with their matching image asset.

Matching is based on basename within the scanned folder. For example, `IMG_1234.CR3`, `IMG_1234.JPG`, and `IMG_1234.XMP` are one asset group for sorting and moving.

## Consequences

Positive:

- Metadata and edit sidecars stay attached to source images.
- Users make one decision per photographic asset instead of managing related files manually.
- The final folder structure is easier to import into Lightroom or another editor.

Tradeoffs:

- The app needs an explicit list of recognized sidecar extensions.
- Ambiguous naming cases need visible handling in the move preview.
- Folder scanning must avoid accidentally grouping unrelated files that merely share a basename.

## Follow-Up Decisions

- Decide whether unknown same-basename files are ignored, warned about, or grouped as generic sidecars.
- Decide how move-plan preview surfaces grouped files.

