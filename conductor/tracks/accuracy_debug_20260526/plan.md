# Implementation Plan: Enhance Predictive Accuracy and Debugging Tools

## Phase 1: Spatial & Network Accuracy [checkpoint: a8b2e10]
- [x] Task: Implement Multi-Point Alignment
    - [x] Write tests for corner-aware dot product calculations
    - [x] Update `usePredictiveFetch` to use maximum dot product of center + 4 corners
- [x] Task: Implement Dynamic Thresholding
    - [x] Create `NetworkSpeedMonitor` utility to measure latency via mock fetch
    - [x] Write tests for threshold adjustment logic based on latency
    - [x] Integrate monitor into `usePredictiveFetch` to auto-adjust threshold
- [x] Task: Conductor - User Manual Verification 'Phase 1: Spatial & Network Accuracy' (Protocol in workflow.md) (a8b2e10)

## Phase 2: Behavioral Recency [checkpoint: 2362a80]
- [x] Task: Implement Markov Sliding Window (1a8c789)
    - [x] Write tests for fixed-window transition storage (purge old entries)
    - [x] Update `MarkovTracker.js` to maintain only the last 50 transitions
- [x] Task: Conductor - User Manual Verification 'Phase 2: Behavioral Recency' (Protocol in workflow.md) (2362a80)

## Phase 3: Visual Debugger
- [ ] Task: Implement Intent Heatmap Overlay
    - [ ] Create `PredictiveDebugger` component to render Canvas/SVG overlay
    - [ ] Implement Vector Ghost (velocity line) and Intent Trail (color-coded dots)
    - [ ] Implement Score Overlays for target elements
- [ ] Task: Integrate Debugger into Demo
    - [ ] Update `PredictiveButtonDemo.jsx` to include a toggle for the debugger
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Visual Debugger' (Protocol in workflow.md)
