import React from 'react';
import PredictiveButtonDemo from './PredictiveButtonDemo';
import MarkovTestBench from './MarkovTestBench';
import PredictiveDebugger from './PredictiveDebugger';
import { useDebug } from './utils/DebugContext';

function App() {
  const { isEnabled, setIsEnabled } = useDebug();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '50px', padding: '50px' }}>
      <PredictiveDebugger />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#edf2f7', padding: '8px 16px', borderRadius: '20px' }}>
            <input 
                type="checkbox" 
                checked={isEnabled} 
                onChange={(e) => setIsEnabled(e.target.checked)} 
            />
            <strong>Enable Visual Debugger</strong>
        </label>
      </div>

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
