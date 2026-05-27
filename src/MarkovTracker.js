/**
 * MarkovTracker
 * A lightweight Markov Chain for predicting the next route based on historical transitions.
 * Implements a fixed-window sliding history to prioritize recency.
 */
export class MarkovTracker {
  constructor(storageKey = 'markov_matrix', windowSize = 50) {
    this.storageKey = storageKey;
    this.historyKey = `${storageKey}_history`;
    this.windowSize = windowSize;
    this.matrix = this.loadMatrix();
    this.history = this.loadHistory();
  }

  loadMatrix() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('MarkovTracker: Failed to load matrix', e);
      return {};
    }
  }

  // Alias for backward compatibility with MarkovTestBench
  load() {
    return this.loadMatrix();
  }

  loadHistory() {
    try {
      const data = localStorage.getItem(this.historyKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('MarkovTracker: Failed to load history', e);
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.matrix));
      localStorage.setItem(this.historyKey, JSON.stringify(this.history));
    } catch (e) {
      console.warn('MarkovTracker: Failed to save data', e);
    }
  }

  /**
   * Records a transition from one route to another.
   * Maintains a sliding window of transitions.
   */
  recordTransition(from, to) {
    if (!from || !to || from === to) return;

    // 1. Add new transition to history
    this.history.push({ from, to });

    // 2. Update Matrix
    if (!this.matrix[from]) this.matrix[from] = {};
    this.matrix[from][to] = (this.matrix[from][to] || 0) + 1;

    // 3. Purge old transition if window exceeded
    if (this.history.length > this.windowSize) {
      const oldest = this.history.shift();
      if (this.matrix[oldest.from] && this.matrix[oldest.from][oldest.to]) {
        this.matrix[oldest.from][oldest.to]--;
        
        // Cleanup empty entries
        if (this.matrix[oldest.from][oldest.to] <= 0) {
          delete this.matrix[oldest.from][oldest.to];
        }
        if (Object.keys(this.matrix[oldest.from]).length === 0) {
          delete this.matrix[oldest.from];
        }
      }
    }

    this.save();
  }

  predictNext(currentRoute) {
    const transitions = this.matrix[currentRoute];
    if (!transitions) return null;

    let total = 0;
    let topRoute = null;
    let maxCount = -1;

    for (const [route, count] of Object.entries(transitions)) {
      total += count;
      if (count > maxCount) {
        maxCount = count;
        topRoute = route;
      }
    }

    if (!topRoute || total === 0) return null;

    return {
      route: topRoute,
      confidence: maxCount / total
    };
  }
}

export default new MarkovTracker();
