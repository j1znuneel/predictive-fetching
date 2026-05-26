import React, { useRef } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePredictiveFetch } from './usePredictiveFetch';
import MarkovTracker from './MarkovTracker';
import NetworkSpeedMonitor from './utils/NetworkSpeedMonitor';

// Helper component for integration test
const TestComponent = ({ url, routeKey }) => {
  const buttonRef = useRef(null);
  const data = usePredictiveFetch(buttonRef, url, { routeKey });
  
  return (
    <div>
      <button ref={buttonRef} data-testid="target-button">
        {data ? 'Fetched' : 'Initial'}
      </button>
      {data && <div data-testid="data-container">{JSON.stringify(data)}</div>}
    </div>
  );
};

describe('Predictive Engine Integration', () => {
  const mockUrl = 'https://api.example.com/integration';

  beforeEach(() => {
    localStorage.clear();
    MarkovTracker.matrix = {};
    
    vi.stubGlobal('fetch', vi.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    ));

    vi.stubGlobal('requestAnimationFrame', vi.fn(cb => cb()));
    
    let currentTime = 0;
    vi.stubGlobal('performance', { 
      now: vi.fn(() => currentTime) 
    });
    vi.stubGlobal('advanceTime', (ms) => { currentTime += ms; });

    vi.spyOn(NetworkSpeedMonitor, 'measureLatency').mockResolvedValue(100);
    vi.spyOn(NetworkSpeedMonitor, 'calculateThreshold').mockReturnValue(0.85);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should trigger prefetch via Markov chain behavioral training', async () => {
    // 1. Train the model: simulate /home -> /target transition 5 times
    for (let i = 0; i < 5; i++) {
        MarkovTracker.recordTransition('/', '/target');
    }

    // 2. Render component. It should recognize high confidence for /target
    render(<TestComponent url={mockUrl} routeKey="/target" />);

    // 3. Wait for effect
    await act(async () => {
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalledWith(mockUrl, { method: 'GET' });
    expect(screen.getByTestId('target-button')).toHaveTextContent('Fetched');
  });

  it('should trigger prefetch via real-time kinematic movement', async () => {
    render(<TestComponent url={mockUrl} routeKey="/other" />);

    // Initial state
    expect(screen.getByTestId('target-button')).toHaveTextContent('Initial');
    expect(global.fetch).not.toHaveBeenCalled();

    // Mock button position
    const button = screen.getByTestId('target-button');
    button.getBoundingClientRect = vi.fn(() => ({
      left: 100, top: 100, right: 150, bottom: 150, width: 50, height: 50
    }));

    // Simulate movement sequence
    // Start far away
    act(() => {
      window.advanceTime(0);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    });

    // Move fast toward button
    act(() => {
      window.advanceTime(100);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    });

    // Slow down right in front of it
    act(() => {
      window.advanceTime(100);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 115, clientY: 115 }));
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalled();
    expect(screen.getByTestId('target-button')).toHaveTextContent('Fetched');
  });
});
