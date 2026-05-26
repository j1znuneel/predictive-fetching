import React, { useRef, useState } from 'react';
import { usePredictiveFetch } from './usePredictiveFetch';

/**
 * PredictiveButtonDemo
 * A manual testing component to visualize the usePredictiveFetch hook.
 */
const PredictiveButtonDemo = ({ id = "1" }) => {
  const buttonRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);
  
  // Use unique URLs for different buttons
  const targetUrl = `https://jsonplaceholder.typicode.com/posts/${id}`;
  
  // 1. Hook usage with routeKey for Markov
  const prefetchedData = usePredictiveFetch(buttonRef, targetUrl, {
    ttl: 5000,
    threshold: 0.85,
    routeKey: `/dashboard/${id}`
  });

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    console.log('Button actually clicked. Data state:', prefetchedData);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>React Predictive Fetch Demo</h1>
      <p>
        Move your mouse toward the button below. Slow down as you approach.
        Watch the <b>Network Tab</b> in DevTools.
      </p>

      <div style={{ 
        margin: '40px 0', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        background: prefetchedData ? '#e6fffa' : '#f7fafc'
      }}>
        <button
          ref={buttonRef}
          onClick={handleClick}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {prefetchedData ? 'Data Prefetched! Click Me' : 'Hover Toward Me'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <strong>Status:</strong> {prefetchedData ? '✅ Data is in cache' : '⏳ Waiting for intent...'}
          <br />
          <strong>Clicks:</strong> {clickCount}
        </div>
      </div>

      {prefetchedData && (
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#4a5568' }}>
          <strong>Prefetched JSON Preview:</strong>
          <pre style={{ background: '#edf2f7', padding: '10px' }}>
            {JSON.stringify(prefetchedData, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '40px', color: '#718096', fontSize: '14px' }}>
        <h3>How to verify manually:</h3>
        <ol>
          <li>Open Browser DevTools (F12) and go to the <b>Network</b> tab.</li>
          <li>Move mouse toward the blue button.</li>
          <li>Notice a <code>posts/1</code> request fire <b>before</b> you click.</li>
          <li>The background of this box turns green when data is ready.</li>
        </ol>
      </div>
    </div>
  );
};

export default PredictiveButtonDemo;
