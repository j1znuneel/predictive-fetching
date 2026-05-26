# Implementation Plan: Enhance Predictive Accuracy and Debugging Tools

## Phase 1: Spatial & Network Accuracy
- [x] Task: Implement Multi-Point Alignment
    - [x] Write tests for corner-aware dot product calculations
    - [x] Update `usePredictiveFetch` to use maximum dot product of center + 4 corners
- [x] Task: Implement Dynamic Thresholding
    - [x] Create `NetworkSpeedMonitor` utility to measure latency via mock fetch
    - [x] Write tests for threshold adjustment logic based on latency
    - [x] Integrate monitor into `usePredictiveFetch` to auto-adjust threshold
- [~] Task: Conductor - User Manual Verification 'Phase 1: Spatial & Network Accuracy' (Protocol in workflow.md)

## Phase 2: Behavioral Recency
- [ ] Task: Implement Markov Sliding Window
    - [ ] Write tests for fixed-window transition storage (purge old entries)
    - [ ] Update `MarkovTracker.js` to maintain only the last 50 transitions
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Behavioral Recency' (Protocol in workflow.md)

## Phase 3: Visual Debugger
- [ ] Task: Implement Intent Heatmap Overlay
    - [ ] Create `PredictiveDebugger` component to render Canvas/SVG overlay
    - [ ] Implement Vector Ghost (velocity line) and Intent Trail (color-coded dots)
    - [ ] Implement Score Overlays for target elements
- [ ] Task: Integrate Debugger into Demo
    - [ ] Update `PredictiveButtonDemo.jsx` to include a toggle for the debugger
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Visual Debugger' (Protocol in workflow.md)
