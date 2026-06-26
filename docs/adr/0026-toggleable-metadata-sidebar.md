# ADR 0026: Metadata Lives in a Toggleable Sidebar

## Status

Accepted

## Context

The main review UI should keep the photo dominant. Filename and metadata display can help when needed, but persistent metadata chrome would compete with the image and filmstrip.

## Decision

Place image metadata in a toggleable sidebar.

The first version does not require extra metadata fields beyond what is necessary for basic review context. Metadata is not shown in a permanent top bar and is not shown in the filmstrip by default.

## Consequences

Positive:

- The image remains the main focus.
- Metadata is available without permanently consuming review space.
- The first version avoids a broad EXIF/metadata feature surface.

Tradeoffs:

- Users who want metadata visible all the time must toggle the sidebar on.
- The exact minimal v1 metadata set still needs to be defined.

## Follow-Up Decisions

- Decide whether sidebar visibility is remembered per user.
