/**
 * Property-Based Tests for Responsive Layout Adaptation
 * 
 * **Feature: punch-revive, Property 25: Responsive layout adaptation**
 * **Validates: Requirements 16.1, 16.2, 16.3**
 * 
 * Tests that the application layout adapts appropriately across different viewport widths:
 * - Mobile layout for ≤768px
 * - Tablet layout for 769-1024px
 * - Desktop layout for >1024px
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  BREAKPOINTS,
  type Breakpoint,
} from './responsive';

describe('Property 25: Responsive layout adaptation', () => {
  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should correctly identify mobile viewport for any width ≤768px', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: BREAKPOINTS.mobile }),
        (width) => {
          const breakpoint = getBreakpoint(width);
          const isMobileWidth = isMobile(width);
          
          // For any width ≤768px, should be identified as mobile
          expect(breakpoint).toBe('mobile');
          expect(isMobileWidth).toBe(true);
          expect(isTablet(width)).toBe(false);
          expect(isDesktop(width)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should correctly identify tablet viewport for any width 769-1024px', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: BREAKPOINTS.mobile + 1, max: BREAKPOINTS.tablet }),
        (width) => {
          const breakpoint = getBreakpoint(width);
          const isTabletWidth = isTablet(width);
          
          // For any width 769-1024px, should be identified as tablet
          expect(breakpoint).toBe('tablet');
          expect(isTabletWidth).toBe(true);
          expect(isMobile(width)).toBe(false);
          expect(isDesktop(width)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should correctly identify desktop viewport for any width >1024px', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: BREAKPOINTS.desktop, max: 4096 }),
        (width) => {
          const breakpoint = getBreakpoint(width);
          const isDesktopWidth = isDesktop(width);
          
          // For any width >1024px, should be identified as desktop
          expect(breakpoint).toBe('desktop');
          expect(isDesktopWidth).toBe(true);
          expect(isMobile(width)).toBe(false);
          expect(isTablet(width)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should have exactly one breakpoint classification for any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 4096 }),
        (width) => {
          // Count how many breakpoint checks return true
          const classifications = [
            isMobile(width),
            isTablet(width),
            isDesktop(width),
          ].filter(Boolean);
          
          // Exactly one should be true
          expect(classifications.length).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should maintain consistent breakpoint classification across boundary values', () => {
    // Test exact boundary values
    const boundaries = [
      { width: BREAKPOINTS.mobile, expected: 'mobile' as Breakpoint },
      { width: BREAKPOINTS.mobile + 1, expected: 'tablet' as Breakpoint },
      { width: BREAKPOINTS.tablet, expected: 'tablet' as Breakpoint },
      { width: BREAKPOINTS.desktop, expected: 'desktop' as Breakpoint },
    ];

    boundaries.forEach(({ width, expected }) => {
      const breakpoint = getBreakpoint(width);
      expect(breakpoint).toBe(expected);
    });
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should have monotonic breakpoint transitions (no gaps or overlaps)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 4095 }),
        (width) => {
          const currentBreakpoint = getBreakpoint(width);
          const nextBreakpoint = getBreakpoint(width + 1);
          
          // Breakpoint should either stay the same or transition to next level
          // Never skip a level or go backwards
          const validTransitions: Record<Breakpoint, Breakpoint[]> = {
            mobile: ['mobile', 'tablet'],
            tablet: ['tablet', 'desktop'],
            desktop: ['desktop'],
          };
          
          expect(validTransitions[currentBreakpoint]).toContain(nextBreakpoint);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should cover all possible viewport widths without gaps', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (width) => {
          const breakpoint = getBreakpoint(width);
          
          // Every width should map to exactly one of the three breakpoints
          expect(['mobile', 'tablet', 'desktop']).toContain(breakpoint);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should have consistent helper function results with getBreakpoint', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 4096 }),
        (width) => {
          const breakpoint = getBreakpoint(width);
          
          // Helper functions should agree with getBreakpoint
          if (breakpoint === 'mobile') {
            expect(isMobile(width)).toBe(true);
            expect(isTablet(width)).toBe(false);
            expect(isDesktop(width)).toBe(false);
          } else if (breakpoint === 'tablet') {
            expect(isMobile(width)).toBe(false);
            expect(isTablet(width)).toBe(true);
            expect(isDesktop(width)).toBe(false);
          } else if (breakpoint === 'desktop') {
            expect(isMobile(width)).toBe(false);
            expect(isTablet(width)).toBe(false);
            expect(isDesktop(width)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should handle edge cases at exact breakpoint values', () => {
    // Test that exact breakpoint values are classified correctly
    const testCases = [
      { width: 1, expected: 'mobile' as Breakpoint },
      { width: 320, expected: 'mobile' as Breakpoint }, // iPhone SE
      { width: 768, expected: 'mobile' as Breakpoint }, // Exact mobile boundary
      { width: 769, expected: 'tablet' as Breakpoint }, // First tablet width
      { width: 1024, expected: 'tablet' as Breakpoint }, // Exact tablet boundary
      { width: 1025, expected: 'desktop' as Breakpoint }, // First desktop width
      { width: 1920, expected: 'desktop' as Breakpoint }, // Full HD
      { width: 3840, expected: 'desktop' as Breakpoint }, // 4K
    ];

    testCases.forEach(({ width, expected }) => {
      const breakpoint = getBreakpoint(width);
      expect(breakpoint).toBe(expected);
    });
  });

  // **Feature: punch-revive, Property 25: Responsive layout adaptation**
  // **Validates: Requirements 16.1, 16.2, 16.3**
  it('should maintain breakpoint stability within same range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 4096 }),
        fc.integer({ min: 0, max: 100 }),
        (baseWidth, offset) => {
          const width1 = baseWidth;
          const width2 = baseWidth + offset;
          
          const breakpoint1 = getBreakpoint(width1);
          const breakpoint2 = getBreakpoint(width2);
          
          // If both widths are in the same range, breakpoint should be the same
          const inSameRange = 
            (width1 <= BREAKPOINTS.mobile && width2 <= BREAKPOINTS.mobile) ||
            (width1 > BREAKPOINTS.mobile && width1 <= BREAKPOINTS.tablet && 
             width2 > BREAKPOINTS.mobile && width2 <= BREAKPOINTS.tablet) ||
            (width1 > BREAKPOINTS.tablet && width2 > BREAKPOINTS.tablet);
          
          if (inSameRange) {
            expect(breakpoint1).toBe(breakpoint2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
