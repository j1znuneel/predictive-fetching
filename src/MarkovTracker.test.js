import { describe, it, expect, beforeEach, vi } from 'vitest';
import MarkovTracker from './MarkovTracker';

describe('MarkovTracker', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the matrix manually since it's a singleton
    MarkovTracker.matrix = {};
  });

  it('should initialize with an empty matrix', () => {
    expect(MarkovTracker.matrix).toEqual({});
  });

  it('should record transitions correctly', () => {
    MarkovTracker.recordTransition('/home', '/dashboard');
    expect(MarkovTracker.matrix['/home']).toBeDefined();
    expect(MarkovTracker.matrix['/home']['/dashboard']).toBe(1);

    MarkovTracker.recordTransition('/home', '/dashboard');
    expect(MarkovTracker.matrix['/home']['/dashboard']).toBe(2);
  });

  it('should not record transitions to the same route', () => {
    MarkovTracker.recordTransition('/home', '/home');
    expect(MarkovTracker.matrix['/home']).toBeUndefined();
  });

  it('should save to localStorage on transition', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    MarkovTracker.recordTransition('/home', '/settings');
    expect(setItemSpy).toHaveBeenCalled();
    
    const stored = JSON.parse(localStorage.getItem('markov_matrix'));
    expect(stored['/home']['/settings']).toBe(1);
  });

  it('should predict the next route based on highest frequency', () => {
    MarkovTracker.recordTransition('/a', '/b');
    MarkovTracker.recordTransition('/a', '/b');
    MarkovTracker.recordTransition('/a', '/c');

    const prediction = MarkovTracker.predictNext('/a');
    expect(prediction.route).toBe('/b');
    expect(prediction.confidence).toBe(2/3);
  });

  it('should return null for prediction if no transitions exist', () => {
    const prediction = MarkovTracker.predictNext('/non-existent');
    expect(prediction).toBeNull();
  });

  it('should handle multiple exit routes', () => {
    MarkovTracker.recordTransition('/start', '/end1');
    MarkovTracker.recordTransition('/start', '/end2');
    MarkovTracker.recordTransition('/start', '/end2');

    const prediction = MarkovTracker.predictNext('/start');
    expect(prediction.route).toBe('/end2');
    expect(prediction.confidence).toBe(2/3);
  });
});
