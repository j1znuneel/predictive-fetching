/**
 * NetworkSpeedMonitor
 * Measures network latency and calculates appropriate prediction thresholds.
 */
export class NetworkSpeedMonitor {
  constructor() {
    this.latency = null;
    this.baseThreshold = 0.85;
  }

  /**
   * Measures latency by timing a small dummy fetch.
   * @returns {Promise<number>} Latency in milliseconds.
   */
  async measureLatency() {
    const start = performance.now();
    try {
      // Small dummy request to measure round-trip time
      await fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'HEAD', mode: 'no-cors' });
      this.latency = performance.now() - start;
    } catch (e) {
      // Fallback if network is down or blocked
      this.latency = 200; 
    }
    return this.latency;
  }

  /**
   * Calculates a dynamic threshold based on measured latency.
   * @param {number} latency - Latency in milliseconds.
   * @returns {number} Adjusted threshold (0.0 to 1.0).
   */
  calculateThreshold(latency) {
    // fast: 50ms -> 0.90 (more conservative)
    // slow: 500ms -> 0.70 (more aggressive)
    const minLat = 50;
    const maxLat = 500;
    const minThreshold = 0.70;
    const maxThreshold = 0.90;

    if (latency <= minLat) return maxThreshold;
    if (latency >= maxLat) return minThreshold;

    // Linear interpolation
    const t = (latency - minLat) / (maxLat - minLat);
    return maxThreshold - t * (maxThreshold - minThreshold);
  }
}

export default new NetworkSpeedMonitor();
