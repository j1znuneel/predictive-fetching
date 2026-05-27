# Implementation Plan: npm Publication Preparation

## Phase 1: Build Infrastructure [checkpoint: e8ba486]
- [x] Task: Integrate Microbundle (98bc599)
    - [x] Install `microbundle` as a dev dependency
    - [x] Add `build` script to `package.json`
    - [x] Configure `package.json` fields (`source`, `main`, `module`, `types`, `exports`)
- [x] Task: Refactor for Export (2774538)
    - [x] Create `src/index.js` as the primary entry point
    - [x] Ensure all public utilities (hooks, classes) are exported from index.js
- [x] Task: Conductor - User Manual Verification 'Phase 1: Build Infrastructure' (Protocol in workflow.md) (e8ba486)

## Phase 2: Documentation & Cleanup [checkpoint: 260e395]
- [x] Task: Create Comprehensive README.md (a4d3b70)
    - [x] Write installation and quick start guides
    - [x] Add API reference for usePredictiveFetch and MarkovTracker
- [x] Task: Package Lean-up (5951a8d)
    - [x] Configure `files` whitelist in `package.json` to exclude demo/tests
    - [x] Ensure `.npmignore` or `.gitignore` is properly handled
- [x] Task: Conductor - User Manual Verification 'Phase 2: Documentation & Cleanup' (Protocol in workflow.md) (260e395)

## Phase 3: Validation & Dry-Run [checkpoint: 913efb9]
- [x] Task: Perform Local Pack Validation (25487b4)
    - [x] Run `npm run build` and verify `dist/` contents
    - [x] Run `npm pack` and inspect the resulting tarball
- [x] Task: Versioning (ac01434)
    - [x] Set final version to `0.1.0`
- [x] Task: Conductor - User Manual Verification 'Phase 3: Validation & Dry-Run' (Protocol in workflow.md) (913efb9)
