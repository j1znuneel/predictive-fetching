import React from 'react';
import PredictiveButtonDemo from './PredictiveButtonDemo';
import MarkovTestBench from './MarkovTestBench';

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '50px', padding: '50px' }}>
      <section>
        <h2>Target A (Top)</h2>
        <PredictiveButtonDemo id="1" />
      </section>
      
      <section>
        <h2>Target B (Bottom)</h2>
        <PredictiveButtonDemo id="2" />
      </section>

      <MarkovTestBench />
    </div>
  );
}

export default App;
