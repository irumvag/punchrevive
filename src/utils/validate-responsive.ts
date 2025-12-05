/**
 * Responsive Design Validation Script
 * 
 * This script validates that all interactive elements meet responsive design requirements
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */

import {
  getViewportType,
  validateAllTouchTargets,
  MIN_TOUCH_TARGET_SIZE,
  BREAKPOINTS,
} from './responsive';

/**
 * Touch target failure info
 */
interface TouchTargetFailure {
  element: HTMLElement;
  width: number;
  height: number;
}

/**
 * Validation result interface
 */
interface ValidationResult {
  passed: boolean;
  viewport: 'mobile' | 'tablet' | 'desktop';
  touchTargetFailures: TouchTargetFailure[];
  breakpointsValid: boolean;
  summary: string;
}

/**
 * Validate responsive design implementation
 * Run this in the browser console to check compliance
 */
export function validateResponsiveDesign(): ValidationResult {
  const viewport = getViewportType();
  const touchTargetFailures = validateAllTouchTargets();
  const breakpointsValid = validateBreakpoints();

  const passed = touchTargetFailures.length === 0 && breakpointsValid;

  const summary = generateSummary(viewport, touchTargetFailures, breakpointsValid);

  return {
    passed,
    viewport,
    touchTargetFailures,
    breakpointsValid,
    summary,
  };
}

/**
 * Validate breakpoint configuration
 */
function validateBreakpoints(): boolean {
  return (
    BREAKPOINTS.mobile === 768 &&
    BREAKPOINTS.tablet === 1024 &&
    BREAKPOINTS.desktop === 1025
  );
}

/**
 * Generate validation summary
 */
function generateSummary(
  viewport: 'mobile' | 'tablet' | 'desktop',
  failures: TouchTargetFailure[],
  breakpointsValid: boolean
): string {
  const lines: string[] = [];

  lines.push('=== Responsive Design Validation ===');
  lines.push('');
  lines.push(`Current Viewport: ${viewport}`);
  lines.push(`Window Size: ${typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}`);
  lines.push('');

  // Breakpoints
  lines.push('Breakpoints:');
  lines.push(`  Mobile: ≤${BREAKPOINTS.mobile}px ${breakpointsValid ? '✓' : '✗'}`);
  lines.push(`  Tablet: ${BREAKPOINTS.mobile + 1}-${BREAKPOINTS.tablet}px ${breakpointsValid ? '✓' : '✗'}`);
  lines.push(`  Desktop: >${BREAKPOINTS.tablet}px ${breakpointsValid ? '✓' : '✗'}`);
  lines.push('');

  // Touch targets
  lines.push('Touch Target Validation:');
  lines.push(`  Minimum Size: ${MIN_TOUCH_TARGET_SIZE}x${MIN_TOUCH_TARGET_SIZE}px`);
  
  if (viewport === 'mobile') {
    if (failures.length === 0) {
      lines.push('  Status: ✓ All interactive elements meet minimum size');
    } else {
      lines.push(`  Status: ✗ ${failures.length} element(s) below minimum size`);
      lines.push('');
      lines.push('  Failed Elements:');
      failures.forEach((failure, index) => {
        const { element, width, height } = failure;
        const tag = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : '';
        const classes = element.className ? `.${element.className.split(' ').join('.')}` : '';
        lines.push(`    ${index + 1}. <${tag}${id}${classes}> - ${Math.round(width)}x${Math.round(height)}px`);
      });
    }
  } else {
    lines.push('  Status: ⊘ Touch target validation only applies to mobile viewport');
  }

  lines.push('');
  lines.push('=== End Validation ===');

  return lines.join('\n');
}

/**
 * Log validation results to console
 */
export function logValidationResults(): void {
  const result = validateResponsiveDesign();
  
  console.log(result.summary);
  
  if (result.passed) {
    console.log('\n✓ All responsive design requirements met!');
  } else {
    console.warn('\n✗ Some responsive design requirements not met. See details above.');
  }
}

/**
 * Get detailed element information for debugging
 */
export function getElementDetails(element: HTMLElement): object {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);

  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || null,
    classes: element.className || null,
    dimensions: {
      width: rect.width,
      height: rect.height,
    },
    computedStyles: {
      minWidth: computedStyle.minWidth,
      minHeight: computedStyle.minHeight,
      padding: computedStyle.padding,
      display: computedStyle.display,
    },
    meetsMinimum: rect.width >= MIN_TOUCH_TARGET_SIZE && rect.height >= MIN_TOUCH_TARGET_SIZE,
  };
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).validateResponsiveDesign = validateResponsiveDesign;
  (window as any).logValidationResults = logValidationResults;
  (window as any).getElementDetails = getElementDetails;
}
