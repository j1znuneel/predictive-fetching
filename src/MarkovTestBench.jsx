import React, { useState, useEffect } from 'react';
import MarkovTracker from './MarkovTracker';

/**
 * MarkovTestBench
 * A tool to visualize and train the Markov transition matrix manually.
 */
const MarkovTestBench = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [matrix, setMatrix] = useState({});
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const data = MarkovTracker.load();
    setMatrix(data);
    setPrediction(MarkovTracker.predictNext(currentPath));
  }, [currentPath]);

  const simulateTransition = (targetPath) => {
    MarkovTracker.recordTransition(currentPath, targetPath);
    // In a real app, you'd navigate here. For testing, we just update state.
    setMatrix(MarkovTracker.load());
    setPrediction(MarkovTracker.predictNext(currentPath));
  };

  const clearData = () => {
    localStorage.removeItem('markov_matrix');
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #4a5568', borderRadius: '8px', marginTop: '20px', backgroundColor: '#fff' }}>
      <h3>Markov Chain Test Bench</h3>
      <p>Current Mock Path: <code>{currentPath}</code></p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => simulateTransition('/dashboard')}>Record → /dashboard</button>
        <button onClick={() => simulateTransition('/profile')}>Record → /profile</button>
        <button onClick={() => simulateTransition('/settings')}>Record → /settings</button>
      </div>

      <div style={{ backgroundColor: '#edf2f7', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
        <strong>Stored Matrix:</strong>
        <pre>{JSON.stringify(matrix, null, 2)}</pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <strong>Prediction:</strong> 
        {prediction ? (
          <span style={{ color: prediction.confidence > 0.8 ? 'green' : 'orange', fontWeight: 'bold' }}>
            {prediction.route} ({(prediction.confidence * 100).toFixed(0)}% confidence)
          </span>
        ) : ' None'}
      </div>

      <button onClick={clearData} style={{ marginTop: '20px', color: '#e53e3e', fontSize: '12px', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
        Clear Stored Data
      </button>

      <div style={{ marginTop: '20px', fontSize: '13px', color: '#718096' }}>
        <strong>To test the 80% threshold:</strong>
        <ol>
          <li>Click <b>"Record → /dashboard"</b> 5 times.</li>
          <li>The confidence for <code>/dashboard</code> will reach 100%.</li>
          <li>Refresh the page. If your <code>usePredictiveFetch</code> has <code>routeKey: '/dashboard'</code>, it will fetch instantly.</li>
        </ol>
      </div>
    </div>
  );
};

export default MarkovTestBench;
