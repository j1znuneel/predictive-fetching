# Specification: npm Publication Preparation

## Overview
This track focuses on transforming the existing codebase from a demonstration app into a production-ready npm package. This involves setting up a formal build process, defining exports, and providing clear entry points for external consumers.

## Functional Requirements

### 1. Library Bundling
- Integrate **Microbundle** as the primary build tool to generate optimized bundles.
- Support both **ES Modules (ESM)** and **CommonJS (CJS)** outputs.
- Automatically generate **TypeScript Type Definitions (.d.ts)** even though the source is currently JS (using JSDoc inference or manual definitions).

### 2. Package Configuration (`package.json`)
- Set the name to `prefetch-ai`.
- Define `main`, `module`, `exports`, and `types` fields correctly.
- Add `files` whitelist to exclude tests, demos, and internal configs from the published package.
- Set an initial version (e.g., `0.1.0`).

### 3. Public API Surface
- Formally export the following from the root entry point:
    - `usePredictiveFetch` (Hook)
    - `MarkovTracker` (Class/Module)
    - `NetworkSpeedMonitor` (Utility)
    - `DebugProvider` / `PredictiveDebugger` (Optional Debug Tools)

### 4. Documentation
- Create a comprehensive `README.md` covering:
    - Features & Benefits.
    - Installation (`npm install prefetch-ai`).
    - Basic Hook Usage.
    - Markov Training Usage.
    - Visual Debugger setup.

## Non-Functional Requirements
- **Bundle Size**: Aim for a footprint < 5kb gzipped.
- **Tree-Shaking**: Ensure consumers can import only what they need without pulling in the entire library.

## Acceptance Criteria
- [ ] `npm run build` generates a `dist/` folder with valid ESM/CJS/DTS files.
- [ ] `package.json` contains all required fields for a modern library.
- [ ] README provides clear instructions for a first-time user.
- [ ] A local `npm pack` dry-run confirms the package content is clean and lean.
