# PrefetchAI

[![npm version](https://img.shields.io/npm/v/prefetch-ai.svg)](https://www.npmjs.com/package/prefetch-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Zero-latency React applications through physical and behavioral intelligence.**

PrefetchAI is a lightweight, dependency-free library that predicts user click intent in real-time. By combining mouse kinematics (physical intent) with Markov chains (behavioral patterns), it triggers background data fetches before a user even clicks, significantly reducing perceived latency.

[NPM Package](https://www.npmjs.com/package/prefetch-ai) | [GitHub Repository](https://github.com/j1znuneel/predictive-fetching)

## Key Features

- **Kinematic Prediction**: High-fidelity mouse tracking (velocity, acceleration, alignment) using `requestAnimationFrame`.
- **Markov Chain Intelligence**: Learns user navigation paths to prefetch data based on historical behavioral patterns.
- **Dynamic Thresholding**: Automatically adjusts prediction confidence based on real-time network latency.
- **Multi-Point Alignment**: High-precision targeting by checking element corners and centers.
- **Safe & Efficient**: Automatic deduplication, 5-second TTL cache, and GET-only prefetching.
- **Visual Debugger**: Integrated diagnostic overlay to inspect prediction scores and vectors in development.

## Installation

```bash
npm install prefetch-ai
```

## Quick Start

### 1. Basic Hook Usage

Use the `usePredictiveFetch` hook on any interactive element. Data starts loading when the user's mouse points toward the target with high velocity and alignment.

```jsx
import { useRef } from 'react';
import { usePredictiveFetch } from 'prefetch-ai';

function ProductLink({ id }) {
  const linkRef = useRef(null);
  
  // Data starts loading when the user's mouse points toward this button
  const { data, loading, error } = usePredictiveFetch(linkRef, `https://api.example.com/products/${id}`);

  return (
    <button ref={linkRef} onClick={() => console.log('Data:', data)}>
      {loading ? 'Preparing...' : 'View Product'}
    </button>
  );
}
```

### 2. Behavioral Intelligence (Markov)

To enable behavioral prediction, record transitions to help the engine learn navigation patterns.

```jsx
import { MarkovTracker } from 'prefetch-ai';

// In your navigation handler
const onNavigate = (to) => {
  MarkovTracker.recordTransition(window.location.pathname, to);
};

// The hook will now prefetch if this route is statistically likely
const data = usePredictiveFetch(ref, url, { 
  routeKey: '/dashboard' 
});
```

### 3. Visual Debugger (Development)

Visualize the underlying predictive engine's calculations.

```jsx
import { DebugProvider, PredictiveDebugger } from 'prefetch-ai';

function App() {
  return (
    <DebugProvider>
      <PredictiveDebugger />
      <YourApp />
    </DebugProvider>
  );
}
```

## API Reference

### `usePredictiveFetch(ref, url, options)`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ttl` | `number` | `5000` | Cache time-to-live in milliseconds. |
| `threshold` | `number` | `0.85` | Confidence threshold for kinematic trigger (0.0 to 1.0). |
| `routeKey` | `string` | `null` | The route to match for Markov behavioral prediction. |

### `MarkovTracker`

- `recordTransition(from, to)`: Updates the transition matrix with a new navigation event.
- `predictNext(currentRoute)`: Returns the most likely next route and its probability.
- `windowSize`: Limits the memory of the tracker to the last $N$ transitions (default: 50).

## License

MIT © [Jishnu](https://github.com/j1znuneel)
