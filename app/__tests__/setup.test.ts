import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have correct environment', () => {
    expect(true).toBe(true);
  });

  it('should have access to fast-check', async () => {
    const fc = await import('fast-check');
    expect(fc).toBeDefined();
  });
});
