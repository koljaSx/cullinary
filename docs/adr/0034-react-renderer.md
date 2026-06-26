# ADR 0034: Use React for the Renderer UI

## Status

Accepted

## Context

The app needs a responsive, keyboard-driven UI with a large image preview, filmstrip, toggleable sidebar, overlays, and move-plan screens. The developer is familiar with React, which reduces implementation friction for the first version.

React and Vite are not alternatives: React is the UI framework, while Vite is the renderer build/dev tool.

## Decision

Use React for the Electron renderer UI in version one.

Keep the Electron security boundary intact: React runs in the renderer, privileged filesystem work stays in the main process or utility process, and renderer access goes through a narrow typed preload API.

## Consequences

Positive:

- Uses a familiar UI framework.
- Fits component-heavy UI needs such as image viewer, filmstrip, overlays, and sidebar.
- Keeps frontend implementation approachable for local iteration.
- Pairs cleanly with Vite for fast local renderer development.

Tradeoffs:

- Renderer state must stay clearly separated from privileged file operations.

## Follow-Up Decisions

- Choose the Electron scaffold/package tooling.
- Define renderer state management patterns for review session state.

