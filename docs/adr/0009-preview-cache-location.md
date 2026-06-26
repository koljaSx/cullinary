# ADR 0009: Store Generated RAW Previews in the App Cache

## Status

Accepted

## Context

RAW-only assets may need generated display previews. Writing generated preview files into the selected photo folder would add app implementation artifacts to the user's shoot directory and could interfere with later import workflows.

## Decision

Store generated RAW previews in the app's user data/cache location, not in the selected photo folder.

Cache entries should be keyed by file identity plus size and modification time so stale previews can be detected when source files change.

## Consequences

Positive:

- The user's photo folder stays clean.
- Cache cleanup can be handled by the app.
- Preview generation can be reused across sessions without changing source directories.

Tradeoffs:

- Moving the photo folder may reduce cache hit rate if the path is part of the key.
- The app needs cache size management.
- Cache invalidation needs to be reliable enough that users do not see previews for the wrong RAW file.

## Follow-Up Decisions

- Define the exact cache key.
- Define cache size limits and cleanup policy.
- Decide whether cache entries should survive app upgrades.

