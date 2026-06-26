# Glossary

This glossary is a living document for the RAW + JPEG photo sorting app.

## Asset

A user-facing photo item shown in the app. In the recommended model, an asset usually represents a RAW file plus its matching JPEG preview, rather than treating each file as a separate decision.

## Decision

The sorting mark applied by the user while reviewing an asset.

Initial decision set:

- `reject`: unusable image.
- `keep`: image worth keeping as-is or for later reference.
- `edit`: image worth keeping and worth a proper RAW edit.

## Edit

A keep decision that also means the RAW file should be prioritized for later development in Lightroom or another RAW editor.

## Folder Move Plan

The batch of file moves prepared after the review session is complete. The app should preview this plan before moving files, especially because RAW files are original source material.

If a destination file already exists, the move plan flags the conflict and waits for the user to choose how to resolve it.

First-version conflict resolutions are `skip` and `rename`. `replace` is not offered.

For grouped assets, conflict resolution applies to the whole asset group rather than individual files.

The default rename suggestion appends `-copy-XX` to the shared basename and preserves each file extension.

## JPEG Preview

The JPEG file displayed quickly during review. The first implementation should prefer explicit camera-created `.jpg`/`.jpeg` files and avoid decoding RAW files in the main review path.

JPEG-only files are also valid sortable assets and move by themselves when no matching RAW exists.

## Filmstrip

A slim bottom strip of asset thumbnails shown during review. The first version includes a filmstrip for orientation, nearby navigation, and progress, but does not include a full grid view.

The filmstrip represents the whole selected folder's review session, using virtualization so only the visible thumbnail range is rendered and loaded.

Each filmstrip item shows the asset's thumbnail image.

Marked thumbnails show the asset's decision icon, and the currently displayed asset has a thin selection outline.

## RAW Preview

A displayable preview generated from a RAW-only asset when no matching JPEG exists. The app should use an embedded RAW preview first for speed, then fall back to full RAW decoding only when no usable embedded preview exists.

Generated RAW previews are cached in the app's user data/cache location, not in the selected photo folder.

Version one uses ExifTool to extract embedded RAW previews. Deeper LibRaw integration for full RAW decoding is deferred until needed.

## Platform Target

Version one targets macOS first. The app should keep a portable Electron architecture where practical, but Windows and Linux packaging are deferred.

Version one distribution is local-only. Signed and notarized macOS builds are deferred until the workflow is ready to share beyond the development machine.

## Project Tooling

Version one uses Electron Forge as the Electron scaffold/package tool, with React and Vite for the renderer and TypeScript across main, preload, and renderer code.

## Renderer

The Electron UI layer. Version one uses React for the renderer because that matches the developer's existing familiarity. React is the UI framework, and Vite is the renderer build/dev tool.

## Main Folder

The folder selected by the user for review. The first version scans only this folder, not nested subfolders. Output folders are created under this folder unless we later decide otherwise.

## Metadata Sidebar

A toggleable sidebar that contains image metadata. Metadata does not appear in a permanent top bar or in the filmstrip by default. The first version keeps this sidebar minimal and does not require extra metadata beyond what is necessary for basic review context.

The metadata sidebar is hidden by default.

First-version fields are filename, asset type, current decision, and the file list in the asset group. EXIF metadata is deferred to a later version.

## RAW File

The original camera file. Version one supports `.cr2`, `.cr3`, `.nef`, `.arw`, `.raf`, `.rw2`, `.orf`, and `.dng`. RAW files are treated as source originals and should not be modified by the app. RAW-only files are still valid sortable assets.

## Supported Image Extensions

Version one supports `.jpg`, `.jpeg`, `.cr2`, `.cr3`, `.nef`, `.arw`, `.raf`, `.rw2`, `.orf`, and `.dng`.

## Review Session

One pass through a selected folder where the user evaluates each asset, typically one at a time, with keyboard-driven navigation and marking.

First-version keyboard controls:

- `X`: reject.
- `P`: keep.
- `E`: keep for edit.
- `Left Arrow`: previous image.
- `Right Arrow`: next image.
- `Space`: toggle between fit-to-view and 100% loupe/zoom preview.

Pressing `X`, `P`, or `E` marks the current asset and automatically advances to the next asset.

The 100% loupe should center on the current cursor position when possible, otherwise on the image center.

When an asset has a decision, the image preview shows a decision icon overlay in the top-right corner.

Decision icon language:

- Reject: red `X`.
- Keep: green checkmark.
- Edit: amber pencil or sliders icon.

## Session File

An autosaved recovery file for an in-progress review session. The first version stores this under the selected folder as `_cullinary-session.json` and updates it after each decision so the user can resume after closing or crashing the app.

After a fully successful final move, the session file is deleted. If finalization is partial or blocked, the session file is kept.

## Sidecar

A related file that travels with an image asset. Version one recognizes `.xmp` sidecars only. `.xmp` files with the same basename as an asset move automatically with that asset.

## Sort Bucket

A destination folder under the main folder for a decision category. First-version buckets:

- `_reject`
- `_keep`
- `_edit`

Rejected assets move to `_reject`; they are not deleted or sent to the OS trash by the app.

Sort buckets are created only when at least one file is moved into them.
