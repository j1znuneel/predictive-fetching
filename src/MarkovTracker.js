/**
 * MarkovTracker
 * A lightweight Markov Chain for predicting the next route based on historical transitions.
 */
class MarkovTracker {
  constructor(storageKey = 'markov_matrix') {
    this.storageKey = storageKey;
    this.matrix = this.load();
  }

  /**
   * Loads the matrix from local storage.
   * Format: { [source]: { [target]: count } }
   */
  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('MarkovTracker: Failed to load matrix', e);
      return {};
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.matrix));
    } catch (e) {
      console.warn('MarkovTracker: Failed to save matrix', e);
    }
  }

  /**
   * Records a transition from one route to another.
   * @param {string} from - The current/source route.
   * @param {string} to - The next/destination route.
   */
  recordTransition(from, to) {
    if (!from || !to || from === to) return;

    if (!this.matrix[from]) {
      this.matrix[from] = {};
    }

    this.matrix[from][to] = (this.matrix[from][to] || 0) + 1;
    this.save();
  }

  /**
   * Predicts the next route based on the current route.
   * @param {string} currentRoute - The current route string.
   * @returns {{ route: string, confidence: number } | null}
   */
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
