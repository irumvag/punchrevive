/**
 * Property-Based Tests for Touch Target Minimum Size
 * 
 * **Feature: punch-revive, Property 26: Touch target minimum size**
 * **Validates: Requirements 16.4, 16.5**
 * 
 * Tests that all interactive elements (buttons, links, inputs) on mobile viewport
 * have touch targets of at least 44×44 pixels for accessibility.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  validateTouchTarget,
  validateTouchTargetSize,
  TOUCH_TARGET_MIN_SIZE,
  MIN_TOUCH_TARGET_SIZE,
  getInteractiveElements,
  validateAllTouchTargets,
} from './responsive';

describe('Property 26: Touch target minimum size', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should validate that elements with dimensions ≥44px pass touch target validation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 200 }),
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 200 }),
        (width, height) => {
          const button = document.createElement('button');
          button.style.width = `${width}px`;
          button.style.height = `${height}px`;
          button.style.padding = '0';
          button.style.margin = '0';
          button.style.border = 'none';
          container.appendChild(button);

          // Any element with both dimensions ≥44px should pass
          const isValid = validateTouchTarget(button);
          expect(isValid).toBe(true);

          container.removeChild(button);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should validate that elements with min-width/min-height ≥44px pass validation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 200 }),
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 200 }),
        (minWidth, minHeight) => {
          const button = document.createElement('button');
          button.style.minWidth = `${minWidth}px`;
          button.style.minHeight = `${minHeight}px`;
          button.style.padding = '0';
          button.style.margin = '0';
          button.style.border = 'none';
          container.appendChild(button);

          // Elements with min-width/min-height ≥44px should pass
          const isValid = validateTouchTarget(button);
          expect(isValid).toBe(true);

          container.removeChild(button);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should reject elements with both dimensions <44px', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: TOUCH_TARGET_MIN_SIZE - 1 }),
        fc.integer({ min: 1, max: TOUCH_TARGET_MIN_SIZE - 1 }),
        (width, height) => {
          const button = document.createElement('button');
          button.style.width = `${width}px`;
          button.style.height = `${height}px`;
          button.style.minWidth = '0';
          button.style.minHeight = '0';
          button.style.padding = '0';
          button.style.margin = '0';
          button.style.border = 'none';
          container.appendChild(button);

          // Elements with both dimensions <44px should fail
          const isValid = validateTouchTarget(button);
          expect(isValid).toBe(false);

          container.removeChild(button);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should have consistent results between validateTouchTarget and validateTouchTargetSize', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20, max: 100 }),
        fc.integer({ min: 20, max: 100 }),
        (width, height) => {
          const button = document.createElement('button');
          button.style.width = `${width}px`;
          button.style.height = `${height}px`;
          button.style.padding = '0';
          button.style.margin = '0';
          button.style.border = 'none';
          container.appendChild(button);

          // Both functions should return the same result
          const result1 = validateTouchTarget(button);
          const result2 = validateTouchTargetSize(button);
          expect(result1).toBe(result2);

          container.removeChild(button);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should correctly identify all interactive elements in a container', () => {
    // Create various interactive elements
    const button = document.createElement('button');
    button.textContent = 'Click me';
    
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Link';
    
    const input = document.createElement('input');
    input.type = 'button';
    
    const divWithRole = document.createElement('div');
    divWithRole.setAttribute('role', 'button');
    
    const divWithClick = document.createElement('div');
    divWithClick.setAttribute('onclick', 'alert("hi")');
    
    container.appendChild(button);
    container.appendChild(link);
    container.appendChild(input);
    container.appendChild(divWithRole);
    container.appendChild(divWithClick);

    const interactiveElements = getInteractiveElements(container);
    
    // Should find all 5 interactive elements
    expect(interactiveElements.length).toBeGreaterThanOrEqual(5);
    expect(interactiveElements).toContain(button);
    expect(interactiveElements).toContain(link);
    expect(interactiveElements).toContain(input);
    expect(interactiveElements).toContain(divWithRole);
    expect(interactiveElements).toContain(divWithClick);
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should validate that min-width/min-height with padding creates sufficient touch target', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 100 }),
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 100 }),
        (minWidth, minHeight) => {
          const button = document.createElement('button');
          // Use min-width/min-height which the validator checks
          button.style.minWidth = `${minWidth}px`;
          button.style.minHeight = `${minHeight}px`;
          button.style.padding = '5px'; // Some padding
          button.style.margin = '0';
          button.style.border = 'none';
          container.appendChild(button);

          // With min-width/min-height >= 44px, should always pass
          const isValid = validateTouchTarget(button);
          expect(isValid).toBe(true);

          container.removeChild(button);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should handle edge case at exactly 44×44 pixels', () => {
    const button = document.createElement('button');
    button.style.width = `${TOUCH_TARGET_MIN_SIZE}px`;
    button.style.height = `${TOUCH_TARGET_MIN_SIZE}px`;
    button.style.padding = '0';
    button.style.margin = '0';
    button.style.border = 'none';
    container.appendChild(button);

    // Exactly 44×44 should pass
    const isValid = validateTouchTarget(button);
    expect(isValid).toBe(true);

    container.removeChild(button);
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should handle edge case at 43×43 pixels (just below threshold)', () => {
    const button = document.createElement('button');
    button.style.width = `${TOUCH_TARGET_MIN_SIZE - 1}px`;
    button.style.height = `${TOUCH_TARGET_MIN_SIZE - 1}px`;
    button.style.minWidth = '0';
    button.style.minHeight = '0';
    button.style.padding = '0';
    button.style.margin = '0';
    button.style.border = 'none';
    container.appendChild(button);

    // 43×43 should fail
    const isValid = validateTouchTarget(button);
    expect(isValid).toBe(false);

    container.removeChild(button);
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should validate that validateAllTouchTargets returns only failing elements', () => {
    // Create mix of valid and invalid elements
    const validButton = document.createElement('button');
    validButton.style.width = '50px';
    validButton.style.height = '50px';
    validButton.style.padding = '0';
    validButton.style.margin = '0';
    validButton.style.border = 'none';
    
    const invalidButton = document.createElement('button');
    invalidButton.style.width = '30px';
    invalidButton.style.height = '30px';
    invalidButton.style.minWidth = '0';
    invalidButton.style.minHeight = '0';
    invalidButton.style.padding = '0';
    invalidButton.style.margin = '0';
    invalidButton.style.border = 'none';
    
    container.appendChild(validButton);
    container.appendChild(invalidButton);

    const failures = validateAllTouchTargets(container);
    
    // Should only return the invalid button
    expect(failures.length).toBeGreaterThanOrEqual(1);
    expect(failures.some(f => f.element === invalidButton)).toBe(true);
    expect(failures.some(f => f.element === validButton)).toBe(false);
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should validate that TOUCH_TARGET_MIN_SIZE constant equals 44', () => {
    // Verify the constant is set correctly per requirements
    expect(TOUCH_TARGET_MIN_SIZE).toBe(44);
    expect(MIN_TOUCH_TARGET_SIZE).toBe(44);
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should handle elements with only width meeting requirement', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 200 }),
        fc.integer({ min: 1, max: TOUCH_TARGET_MIN_SIZE - 1 }),
        (width, height) => {
          const button = document.createElement('button');
          button.style.width = `${width}px`;
          button.style.height = `${height}px`;
          button.style.minWidth = '0';
          button.style.minHeight = '0';
          button.style.padding = '0';
          button.style.margin = '0';
          button.style.border = 'none';
          container.appendChild(button);

          // Must meet BOTH width AND height requirements
          const isValid = validateTouchTarget(button);
          expect(isValid).toBe(false);

          container.removeChild(button);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: punch-revive, Property 26: Touch target minimum size**
  // **Validates: Requirements 16.4, 16.5**
  it('should handle elements with only height meeting requirement', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: TOUCH_TARGET_MIN_SIZE - 1 }),
        fc.integer({ min: TOUCH_TARGET_MIN_SIZE, max: 200 }),
        (width, height) => {
          const button = document.createElement('button');
          button.style.width = `${width}px`;
          button.style.height = `${height}px`;
          button.style.minWidth = '0';
          button.style.minHeight = '0';
          button.style.padding = '0';
          button.style.margin = '0';
          button.style.border = 'none';
          container.appendChild(button);

          // Must meet BOTH width AND height requirements
          const isValid = validateTouchTarget(button);
          expect(isValid).toBe(false);

          container.removeChild(button);
        }
      ),
      { numRuns: 100 }
    );
  });
});
