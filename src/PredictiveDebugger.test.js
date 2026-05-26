import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PredictiveDebugger from './PredictiveDebugger';
import { DebugProvider } from './utils/DebugContext';

describe('PredictiveDebugger', () => {
  it('should not render when disabled', () => {
    const { container } = render(
      <DebugProvider>
        <PredictiveDebugger />
      </DebugProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  // JSDOM doesn't support canvas well, so we just check for existence
  // in a more integration-like way if possible, or skip deep canvas testing.
});
