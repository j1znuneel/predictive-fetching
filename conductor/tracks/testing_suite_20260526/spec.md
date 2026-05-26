# Specification: Testing Suite for Predictive Engine

## Goal
To implement a comprehensive suite of unit and integration tests for the `usePredictiveFetch` hook and the `MarkovTracker` module. This ensures the reliability of the predictive logic and maintains high code quality as the project grows.

## Scope
- **MarkovTracker**: Unit tests for loading, saving, recording transitions, and predicting next routes.
- **usePredictiveFetch**: Unit tests for the React hook, covering kinematic calculations, probability thresholds, caching logic, and Markov integration.
- **Integration**: Testing the end-to-end flow from user movement/behavior to data prefetching.

## Acceptance Criteria
- All tests pass in the Vitest environment.
- Code coverage for `MarkovTracker.js` and `usePredictiveFetch.js` exceeds 80%.
- Tests cover edge cases (e.g., empty storage, rapid movement, overshoot protection).
- Manual verification confirms that prefetches are triggered correctly based on both kinematic and behavioral signals.
