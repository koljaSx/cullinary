# Roadmap Notes

These are useful ideas intentionally deferred from the first version.

## Deferred From V1

### Progress Counts During Review

Show compact review progress and decision counts, such as:

- Current position and total assets.
- Reject count.
- Keep count.
- Edit count.
- Unmarked count.

Reason for deferral: version one should keep the review UI minimal and focus on the core sort-and-move workflow.

### Windows and Linux Packaging

Package and test the app for Windows and Linux after the macOS-first version is working well.

Reason for deferral: version one targets macOS first to reduce packaging, file-permission, signing, and RAW preview tooling complexity.

### Signed and Notarized macOS Builds

Add Developer ID signing, notarization, and a shareable macOS build after the local workflow is stable.

Reason for deferral: version one is local-only, so distribution hardening should not block core sorting workflow development.

The local package script may use ad-hoc signing so macOS can run the development bundle. That does not replace Developer ID signing or notarization.

### Auto-Update

Add an update mechanism after there is a shareable signed build.

Reason for deferral: local-only v1 does not need an updater.

### Full RAW Decoding

Add LibRaw or another RAW decoder when embedded preview extraction is not enough.

Reason for deferral: version one uses ExifTool to extract embedded RAW previews, which better matches the fast triage workflow and avoids native decoder complexity at the start.

### Geo Data and Geotagging

Add support for viewing, adding, and updating geo data for images in a later version.

Reason for deferral: version one focuses on fast review, decisions, and folder organization. Geo workflows need a clearer metadata model, EXIF write strategy, and UI for setting or correcting locations.

### Hardware-Accelerated Rendering

Re-enable and tune hardware acceleration after the local v1 workflow is stable.

Reason for deferral: a native Electron crash report on macOS 26.5.1 pointed at Electron/Chromium native worker code, so v1 starts with hardware acceleration disabled for stability.
