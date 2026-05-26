import { describe, it, expect } from 'vitest';
import { calculateBestFitAlignment } from './utils/kinematics';

describe('calculateBestFitAlignment', () => {
  const rect = {
    left: 100,
    top: 100,
    right: 300,
    bottom: 150,
    width: 200,
    height: 50
  };

  it('should return 1.0 when moving perfectly toward the center', () => {
    const cursorPos = { x: 0, y: 125 };
    const velocity = { x: 100, y: 0 }; // Moving right toward center
    const score = calculateBestFitAlignment(cursorPos, velocity, rect);
    expect(score).toBeCloseTo(1.0, 5);
  });

  it('should return a high score when moving toward a corner', () => {
    const cursorPos = { x: 50, y: 50 };
    // Vector to top-left corner (100, 100) is (50, 50)
    // Normalized is (0.707, 0.707)
    const velocity = { x: 50, y: 50 }; 
    const score = calculateBestFitAlignment(cursorPos, velocity, rect);
    expect(score).toBeCloseTo(1.0, 5);
  });

  it('should return maximum dot product among all points', () => {
    const cursorPos = { x: 50, y: 125 };
    // Center is (200, 125). Top-left is (100, 100).
    // Vector to center: (150, 0) -> normalized (1, 0)
    // Vector to top-left: (50, -25) -> normalized (0.89, -0.44)
    const velocity = { x: 10, y: 0 }; // Moving perfectly right toward center
    const score = calculateBestFitAlignment(cursorPos, velocity, rect);
    expect(score).toBeCloseTo(1.0, 5); // Should match center
  });

  it('should return 0 or negative if moving away from all points', () => {
    const cursorPos = { x: 50, y: 125 };
    const velocity = { x: -10, y: 0 }; // Moving left, away from rect
    const score = calculateBestFitAlignment(cursorPos, velocity, rect);
    expect(score).toBeLessThanOrEqual(0);
  });
});
