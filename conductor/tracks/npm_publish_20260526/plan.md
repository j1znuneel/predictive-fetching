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

## Phase 2: Documentation & Cleanup
- [x] Task: Create Comprehensive README.md (a4d3b70)
    - [x] Write installation and quick start guides
    - [x] Add API reference for usePredictiveFetch and MarkovTracker
- [ ] Task: Package Lean-up
    - [ ] Configure `files` whitelist in `package.json` to exclude demo/tests
    - [ ] Ensure `.npmignore` or `.gitignore` is properly handled
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Documentation & Cleanup' (Protocol in workflow.md)

## Phase 3: Validation & Dry-Run
- [ ] Task: Perform Local Pack Validation
    - [ ] Run `npm run build` and verify `dist/` contents
    - [ ] Run `npm pack` and inspect the resulting tarball
- [ ] Task: Versioning
    - [ ] Set final version to `0.1.0`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Validation & Dry-Run' (Protocol in workflow.md)
