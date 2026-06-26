# ADR 0036: Use Electron Forge for the App Scaffold

## Status

Accepted

## Context

The app needs a conventional Electron structure with separate main, preload, and renderer code, local development commands, and a path toward future packaging. The renderer will use React and Vite, and the first version is local-only.

## Decision

Use Electron Forge as the Electron scaffold/package tool for version one.

Use TypeScript across main, preload, and renderer code. Keep React and Vite in the renderer toolchain while maintaining a narrow typed preload API between renderer and privileged filesystem operations.

## Consequences

Positive:

- Provides a familiar Electron project shape.
- Supports local development and a future packaging path.
- Works with the accepted React + Vite renderer tooling.

Tradeoffs:

- Packaging still needs hardening before shareable builds.
- Forge configuration needs care to preserve the strict security boundary.

## Follow-Up Decisions

- Define the exact main/preload/renderer directory structure.
- Define how IPC contracts are typed and tested.
- Revisit packaging settings before a shareable macOS build.

