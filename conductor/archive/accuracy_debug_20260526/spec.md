# Specification: Enhance Predictive Accuracy and Debugging Tools

## Overview
This track aims to refine the predictive engines (Kinematic and Markov) by adding environment-aware thresholding, temporal weighting, and better spatial alignment. It also introduces a developer-facing visualization layer to inspect the internal prediction logic in real-time.

## Functional Requirements

### 1. Dynamic Thresholding (Network-Aware)
- Implement a latency measurement mechanism (e.g., timing a small dummy fetch).
- Dynamically adjust the base prediction threshold (default 0.85).
- Faster networks should increase the threshold (more conservative), while slower networks should lower it (more aggressive).

### 2. Intent Heatmaps (Visual Debugger)
- Create a debug overlay that can be toggled via props or a global flag.
- **Vector Ghost**: Draw a translucent line from the cursor indicating the current velocity vector.
- **Intent Trail**: Leave a trail of dots behind the mouse, color-coded by the intent score (e.g., Red=Low, Green=High).
- **Score Overlays**: Display the current real-time score next to the target element.

### 3. Temporal Markov Decay
- Implement a **Fixed Window** decay for the Markov matrix.
- Only the most recent $N$ transitions (e.g., 50) should be considered for prediction.
- Older transitions are purged to ensure the model adapts to the user's current session goals.

### 4. Multi-Point Alignment
- Improve spatial accuracy by calculating vectors toward the center and the four corners of the target's bounding box.
- Use the **Best Fit Alignment** (maximum dot product) among the 5 points to determine the final alignment score. This handles large or non-square elements more accurately.

## Non-Functional Requirements
- **Performance**: The visual debugger must not impact the 60fps movement loop when disabled.
- **Memory**: The Markov window purge must be efficient and not cause storage bloat.

## Acceptance Criteria
- [ ] Threshold decreases linearly with increased measured latency.
- [ ] Debugger accurately reflects the internal scores and vectors.
- [ ] Markov predictions ignore transitions older than the fixed window size.
- [ ] Multi-point alignment correctly triggers for wide buttons when moving toward a corner.
