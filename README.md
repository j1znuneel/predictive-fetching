# PrefetchAI 🚀

**Zero-latency React applications through physical and behavioral intelligence.**

PrefetchAI is a lightweight, dependency-free library that predicts user click intent in real-time. By combining mouse kinematics (physical intent) with Markov chains (behavioral patterns), it triggers background data fetches before a user even clicks a button, creating a "zero-loading" experience.

## ✨ Features

- 🖱️ **Kinematic Prediction**: High-fidelity mouse tracking (velocity, acceleration, alignment) using `requestAnimationFrame`.
- 🧠 **Markov Chain Intelligence**: Learns user navigation paths to prefetch data the millisecond a page loads.
- ⚡ **Dynamic Thresholding**: Automatically adjusts prediction confidence based on real-time network latency.
- 🎯 **Multi-Point Alignment**: Surgically accurate targeting by checking element corners, not just centers.
- 🛡️ **Safe & Efficient**: Automatic deduplication, 5-second TTL cache, and GET-only prefetching.
- 🔍 **Visual Debugger**: Live diagnostic overlay to inspect prediction scores and vectors in development.

## 📦 Installation

```bash
npm install prefetch-ai
```

## 🚀 Quick Start

### 1. The Basic Hook

Use the `usePredictiveFetch` hook on any link or button.

```jsx
import { useRef } from 'react';
import { usePredictiveFetch } from 'prefetch-ai';

function ProductLink({ id }) {
  const linkRef = useRef(null);
  
  // Data starts loading when the user's mouse points toward this button
  const data = usePredictiveFetch(linkRef, `https://api.example.com/products/${id}`);

  return (
    <button ref={linkRef} onClick={() => console.log('Fast data:', data)}>
      {data ? 'Ready to View!' : 'View Product'}
    </button>
  );
}
```

### 2. Behavioral Intelligence (Markov)

To enable behavioral prediction, tell the library when transitions occur.

```jsx
import { MarkovTracker } from 'prefetch-ai';

// In your router or navigation handler
const onNavigate = (to) => {
  MarkovTracker.recordTransition(window.location.pathname, to);
};

// In your component
const data = usePredictiveFetch(ref, url, { 
  routeKey: '/dashboard' // Link this hook to a specific behavioral path
});
```

### 3. Visual Debugger (Dev Mode)

Visualize the "invisible" intelligence of the engine.

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

## 📖 API Reference

### `usePredictiveFetch(ref, url, options)`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ttl` | `number` | `5000` | Cache time-to-live in milliseconds. |
| `threshold` | `number` | `0.85` | Confidence threshold for kinematic trigger. |
| `routeKey` | `string` | `null` | The route to match for Markov behavioral prediction. |

### `MarkovTracker`

- `recordTransition(from, to)`: Updates the transition matrix.
- `predictNext(currentRoute)`: Returns the most likely next route and confidence.
- `windowSize`: Set to `50` by default. Prioritizes the last $N$ transitions.

## 🛡️ License

MIT © [Jishnu]
