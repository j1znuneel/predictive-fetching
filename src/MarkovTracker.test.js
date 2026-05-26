import { describe, it, expect, beforeEach, vi } from 'vitest';
import MarkovTracker from './MarkovTracker';

describe('MarkovTracker', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the matrix and history manually since it's a singleton
    MarkovTracker.matrix = {};
    MarkovTracker.history = [];
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

  it('should maintain only the last N transitions', () => {
    // Force a small window for testing
    const originalWindow = MarkovTracker.windowSize;
    MarkovTracker.windowSize = 3;

    MarkovTracker.recordTransition('/a', '/b');
    MarkovTracker.recordTransition('/b', '/c');
    MarkovTracker.recordTransition('/c', '/d');
    
    // Matrix should represent a->b, b->c, c->d
    expect(MarkovTracker.predictNext('/a')).toBeDefined();
    
    // Record 4th transition. /a -> /b should be purged.
    MarkovTracker.recordTransition('/d', '/e');

    expect(MarkovTracker.predictNext('/a')).toBeNull();
    expect(MarkovTracker.predictNext('/d').route).toBe('/e');

    MarkovTracker.windowSize = originalWindow;
  });

  it('should update matrix counts correctly after purge', () => {
    MarkovTracker.windowSize = 2;

    MarkovTracker.recordTransition('/a', '/b');
    MarkovTracker.recordTransition('/a', '/b');
    
    expect(MarkovTracker.predictNext('/a').confidence).toBe(1.0);

    // This should purge the first /a -> /b
    MarkovTracker.recordTransition('/b', '/c');

    // Matrix should now have one /a->/b and one /b->/c
    expect(MarkovTracker.matrix['/a']['/b']).toBe(1);
    expect(MarkovTracker.matrix['/b']['/c']).toBe(1);

    MarkovTracker.windowSize = 50;
  });
});
