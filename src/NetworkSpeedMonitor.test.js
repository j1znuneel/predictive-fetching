import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NetworkSpeedMonitor } from './utils/NetworkSpeedMonitor';

describe('NetworkSpeedMonitor', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should measure latency correctly', async () => {
    global.fetch.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ ok: true }), 50);
    }));

    const monitor = new NetworkSpeedMonitor();
    const latency = await monitor.measureLatency();
    
    expect(latency).toBeGreaterThanOrEqual(50);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should adjust threshold based on latency', () => {
    const monitor = new NetworkSpeedMonitor();
    
    // Low latency (Fast network) -> Higher threshold (More conservative)
    expect(monitor.calculateThreshold(50)).toBeGreaterThan(0.85);
    
    // High latency (Slow network) -> Lower threshold (More aggressive)
    expect(monitor.calculateThreshold(500)).toBeLessThan(0.85);
  });
});
