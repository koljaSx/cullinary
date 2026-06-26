# ADR 0035: Use Vite for React Renderer Tooling

## Status

Accepted

## Context

The renderer UI will be built with React. The app is local-only for version one, so fast iteration during development is more important than solving every shareable packaging concern immediately.

React and Vite serve different roles: React is the renderer UI framework, and Vite is the renderer build/dev tool.

## Decision

Use Vite as the build/dev tool for the React renderer in version one.

Electron Forge is the Electron scaffold/package tool.

## Consequences

Positive:

- Fast renderer development loop.
- Good fit for React and TypeScript UI work.
- Keeps v1 local iteration lightweight.

Tradeoffs:

- The final shareable build may require packaging adjustments later.

## Follow-Up Decisions

- Define how main, preload, and renderer builds are wired together.

