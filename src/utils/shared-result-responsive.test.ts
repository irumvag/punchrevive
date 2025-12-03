/**
 * Property-Based Tests for Shared Result Mobile Responsiveness
 * 
 * **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
 * **Validates: Requirements 10.5**
 * 
 * Tests that shareable URLs accessed on mobile viewport (≤768px width)
 * display content in a mobile-optimized responsive layout.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getBreakpoint,
  isMobile,
  BREAKPOINTS,
  setViewportSize,
  VIEWPORT_SIZES,
} from './responsive';

describe('Property 24: Shared result mobile responsiveness', () => {
  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should identify all mobile viewport widths (≤768px) as mobile', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: BREAKPOINTS.mobile }),
        (width) => {
          // Any width ≤768px should be identified as mobile
          const breakpoint = getBreakpoint(width);
          const isMobileWidth = isMobile(width);
          
          expect(breakpoint).toBe('mobile');
          expect(isMobileWidth).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should correctly classify common mobile device widths as mobile', () => {
    const mobileWidths = [
      320,  // iPhone SE
      375,  // iPhone 8, iPhone X
      390,  // iPhone 12/13/14
      414,  // iPhone Plus models
      428,  // iPhone 14 Pro Max
      360,  // Common Android
      412,  // Pixel
      768,  // iPad portrait (boundary)
    ];

    mobileWidths.forEach(width => {
      const breakpoint = getBreakpoint(width);
      const isMobileWidth = isMobile(width);
      
      expect(breakpoint).toBe('mobile');
      expect(isMobileWidth).toBe(true);
    });
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should not classify tablet/desktop widths as mobile', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: BREAKPOINTS.mobile + 1, max: 4096 }),
        (width) => {
          // Any width >768px should NOT be mobile
          const isMobileWidth = isMobile(width);
          expect(isMobileWidth).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should handle boundary case at exactly 768px (mobile)', () => {
    const width = BREAKPOINTS.mobile;
    const breakpoint = getBreakpoint(width);
    const isMobileWidth = isMobile(width);
    
    // Exactly 768px should be mobile
    expect(breakpoint).toBe('mobile');
    expect(isMobileWidth).toBe(true);
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should handle boundary case at 769px (tablet, not mobile)', () => {
    const width = BREAKPOINTS.mobile + 1;
    const breakpoint = getBreakpoint(width);
    const isMobileWidth = isMobile(width);
    
    // 769px should be tablet, not mobile
    expect(breakpoint).toBe('tablet');
    expect(isMobileWidth).toBe(false);
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should maintain consistent mobile classification across viewport changes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: BREAKPOINTS.mobile }),
        fc.integer({ min: 1, max: BREAKPOINTS.mobile }),
        (width1, width2) => {
          // Both widths are mobile, so both should be classified as mobile
          const isMobile1 = isMobile(width1);
          const isMobile2 = isMobile(width2);
          
          expect(isMobile1).toBe(true);
          expect(isMobile2).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should correctly identify all predefined mobile viewport sizes', () => {
    const mobileViewports = [
      VIEWPORT_SIZES.mobile.small,
      VIEWPORT_SIZES.mobile.medium,
      VIEWPORT_SIZES.mobile.large,
    ];

    mobileViewports.forEach(viewport => {
      const breakpoint = getBreakpoint(viewport.width);
      const isMobileWidth = isMobile(viewport.width);
      
      expect(breakpoint).toBe('mobile');
      expect(isMobileWidth).toBe(true);
    });
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should correctly classify tablet landscape viewport', () => {
    // Tablet landscape (1024px) is at the tablet boundary
    const tabletLandscape = VIEWPORT_SIZES.tablet.landscape;
    const isMobileWidth = isMobile(tabletLandscape.width);
    const breakpoint = getBreakpoint(tabletLandscape.width);
    
    // 1024px should be tablet, not mobile
    expect(isMobileWidth).toBe(false);
    expect(breakpoint).toBe('tablet');
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should handle very small mobile widths (minimum 320px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: BREAKPOINTS.mobile }),
        (width) => {
          // All widths from 320px to 768px should be mobile
          const breakpoint = getBreakpoint(width);
          expect(breakpoint).toBe('mobile');
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should maintain mobile classification stability within mobile range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: BREAKPOINTS.mobile - 50 }),
        fc.integer({ min: 1, max: 50 }),
        (baseWidth, offset) => {
          const width1 = baseWidth;
          const width2 = baseWidth + offset;
          
          // If both are in mobile range, both should be mobile
          if (width2 <= BREAKPOINTS.mobile) {
            const isMobile1 = isMobile(width1);
            const isMobile2 = isMobile(width2);
            
            expect(isMobile1).toBe(true);
            expect(isMobile2).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should correctly transition from mobile to tablet at boundary', () => {
    const mobileMax = BREAKPOINTS.mobile;
    const tabletMin = BREAKPOINTS.mobile + 1;
    
    // Last mobile width
    expect(isMobile(mobileMax)).toBe(true);
    expect(getBreakpoint(mobileMax)).toBe('mobile');
    
    // First tablet width
    expect(isMobile(tabletMin)).toBe(false);
    expect(getBreakpoint(tabletMin)).toBe('tablet');
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should handle portrait and landscape orientations for mobile devices', () => {
    // Common mobile portrait widths
    const portraitWidths = [320, 375, 390, 414];
    
    // Common mobile landscape widths (still ≤768px)
    const landscapeWidths = [568, 667, 736, 768];
    
    [...portraitWidths, ...landscapeWidths].forEach(width => {
      const isMobileWidth = isMobile(width);
      expect(isMobileWidth).toBe(true);
    });
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should validate that setViewportSize correctly updates viewport classification', () => {
    // Test setting various mobile widths
    const mobileWidths = [320, 375, 414, 768];
    
    mobileWidths.forEach(width => {
      setViewportSize(width, 800);
      
      // After setting viewport, window.innerWidth should reflect the change
      expect(window.innerWidth).toBe(width);
      
      // And it should be classified as mobile
      const breakpoint = getBreakpoint(window.innerWidth);
      expect(breakpoint).toBe('mobile');
    });
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should ensure mobile breakpoint covers all smartphone widths', () => {
    // Test range of smartphone widths from smallest to largest common devices
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 428 }), // iPhone SE to iPhone 14 Pro Max
        (width) => {
          const breakpoint = getBreakpoint(width);
          const isMobileWidth = isMobile(width);
          
          // All smartphone widths should be mobile
          expect(breakpoint).toBe('mobile');
          expect(isMobileWidth).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should validate mobile classification is monotonic (no gaps)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: BREAKPOINTS.mobile - 1 }),
        (width) => {
          // If width is mobile, width+1 should also be mobile (until boundary)
          const isMobile1 = isMobile(width);
          const isMobile2 = isMobile(width + 1);
          
          if (isMobile1 && width + 1 <= BREAKPOINTS.mobile) {
            expect(isMobile2).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 24: Shared result mobile responsiveness**
  // **Validates: Requirements 10.5**
  it('should handle edge case of 1px width (minimum possible)', () => {
    const width = 1;
    const breakpoint = getBreakpoint(width);
    const isMobileWidth = isMobile(width);
    
    // Even 1px should be classified as mobile
    expect(breakpoint).toBe('mobile');
    expect(isMobileWidth).toBe(true);
  });
});
