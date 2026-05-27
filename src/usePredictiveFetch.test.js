import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePredictiveFetch } from './usePredictiveFetch';
import MarkovTracker from './MarkovTracker';
import NetworkSpeedMonitor from './utils/NetworkSpeedMonitor';
import { DebugProvider } from './utils/DebugContext';

describe('usePredictiveFetch', () => {
  let targetRef;
  const mockUrl = 'https://api.example.com/data';

  beforeEach(() => {
    targetRef = {
      current: document.createElement('button')
    };
    targetRef.current.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 100,
      right: 150,
      bottom: 150,
      width: 50,
      height: 50,
    }));

    vi.stubGlobal('fetch', vi.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'success' })
      })
    ));

    // Mock rAF to execute immediately
    vi.stubGlobal('requestAnimationFrame', vi.fn(cb => cb()));
    
    let currentTime = 0;
    vi.stubGlobal('performance', { 
      now: vi.fn(() => currentTime) 
    });
    vi.stubGlobal('advanceTime', (ms) => { 
        currentTime += ms; 
    });

    vi.spyOn(MarkovTracker, 'predictNext').mockReturnValue(null);
    vi.spyOn(NetworkSpeedMonitor, 'measureLatency').mockResolvedValue(100);
    vi.spyOn(NetworkSpeedMonitor, 'calculateThreshold').mockReturnValue(0.85);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with null data', () => {
    const { result } = renderHook(() => usePredictiveFetch(targetRef, mockUrl), {
        wrapper: DebugProvider
    });
    expect(result.current).toBeNull();
  });

  it('should prefetch immediately if Markov confidence is high', async () => {
    vi.spyOn(MarkovTracker, 'predictNext').mockReturnValue({
      route: '/dashboard',
      confidence: 0.9
    });

    const { result } = renderHook(() => usePredictiveFetch(targetRef, mockUrl, { routeKey: '/dashboard' }), {
        wrapper: DebugProvider
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalledWith(mockUrl, { method: 'GET' });
    expect(result.current).toEqual({ data: 'success' });
  });

  it('should prefetch when kinematic threshold is met', async () => {
    const { result } = renderHook(() => usePredictiveFetch(targetRef, mockUrl), {
        wrapper: DebugProvider
    });

    // 1. Initial position
    act(() => {
      window.advanceTime(0);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    });

    // 2. High speed movement (dt=100, dx=100, dy=100 -> speed=1414)
    act(() => {
      window.advanceTime(100);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    });

    // 3. Significant deceleration and proximity (dt=100, dx=15, dy=15 -> speed=212.1, accel=-12021)
    act(() => {
      window.advanceTime(100);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 115, clientY: 115 }));
    });

    // Final wait for any pending effects
    await act(async () => {
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalled();
    expect(result.current).toEqual({ data: 'success' });
  });

  it('should respect overshoot protection', async () => {
    renderHook(() => usePredictiveFetch(targetRef, mockUrl), {
        wrapper: DebugProvider
    });

    act(() => {
      window.advanceTime(0);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 125, clientY: 140 }));
    });

    act(() => {
      window.advanceTime(100);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 125, clientY: 160 })); // Past bottom
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should use cache if within TTL', async () => {
    vi.spyOn(MarkovTracker, 'predictNext').mockReturnValue({
      route: '/dashboard',
      confidence: 0.9
    });

    const { result, rerender } = renderHook(
      ({ url, routeKey }) => usePredictiveFetch(targetRef, url, { routeKey }), 
      {
        initialProps: { url: mockUrl, routeKey: '/dashboard' },
        wrapper: DebugProvider
      }
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    global.fetch.mockClear();
    rerender({ url: mockUrl, routeKey: '/dashboard' });

    await act(async () => {
      await Promise.resolve();
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current).toEqual({ data: 'success' });
  });
});
