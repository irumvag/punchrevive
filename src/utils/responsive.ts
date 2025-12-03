/**
 * Responsive Design Utilities
 * 
 * Utilities for validating and testing responsive design requirements
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025,
} as const;

export const TOUCH_TARGET_MIN_SIZE = 44; // pixels
export const MIN_TOUCH_TARGET_SIZE = 44; // Alias for compatibility

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
export type ViewportType = 'mobile' | 'tablet' | 'desktop';

/**
 * Determine which breakpoint a given viewport width falls into
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width <= BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (width <= BREAKPOINTS.tablet) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Get the current viewport type based on window width
 */
export function getViewportType(): ViewportType {
  if (typeof window === 'undefined') return 'desktop';
  return getBreakpoint(window.innerWidth);
}

/**
 * Check if a viewport width is mobile
 */
export function isMobile(width: number): boolean {
  return width <= BREAKPOINTS.mobile;
}

/**
 * Check if current viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return isMobile(window.innerWidth);
}

/**
 * Check if a viewport width is tablet
 */
export function isTablet(width: number): boolean {
  return width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;
}

/**
 * Check if current viewport is tablet
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return isTablet(window.innerWidth);
}

/**
 * Check if a viewport width is desktop
 */
export function isDesktop(width: number): boolean {
  return width > BREAKPOINTS.tablet;
}

/**
 * Check if current viewport is desktop
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return isDesktop(window.innerWidth);
}

/**
 * Validate that an element meets minimum touch target size requirements
 * Returns true if the element is at least 44x44 pixels
 */
export function validateTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  
  // Get the actual clickable area
  let width = rect.width;
  let height = rect.height;
  
  // Check if element has min-width/min-height set (if window is available)
  if (typeof window !== 'undefined') {
    const computedStyle = window.getComputedStyle(element);
    
    // In test environments (jsdom), getBoundingClientRect may return 0
    // so we fall back to computed styles
    if (width === 0) {
      width = parseFloat(computedStyle.width) || 0;
    }
    if (height === 0) {
      height = parseFloat(computedStyle.height) || 0;
    }
    
    const minWidth = parseFloat(computedStyle.minWidth) || 0;
    const minHeight = parseFloat(computedStyle.minHeight) || 0;
    
    // Element passes if either actual size or minimum size meets requirements
    const meetsWidth = width >= TOUCH_TARGET_MIN_SIZE || minWidth >= TOUCH_TARGET_MIN_SIZE;
    const meetsHeight = height >= TOUCH_TARGET_MIN_SIZE || minHeight >= TOUCH_TARGET_MIN_SIZE;
    
    return meetsWidth && meetsHeight;
  }
  
  // Fallback for test environments
  return width >= TOUCH_TARGET_MIN_SIZE && height >= TOUCH_TARGET_MIN_SIZE;
}

/**
 * Alias for validateTouchTarget for compatibility
 */
export function validateTouchTargetSize(element: HTMLElement): boolean {
  return validateTouchTarget(element);
}

/**
 * Get all interactive elements on the page
 */
export function getInteractiveElements(container: HTMLElement = document.body): HTMLElement[] {
  const selectors = [
    'button',
    'a',
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="reset"]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[onclick]',
    '[tabindex]:not([tabindex="-1"])',
  ];
  
  const elements = container.querySelectorAll(selectors.join(', '));
  return Array.from(elements) as HTMLElement[];
}

/**
 * Validate all interactive elements meet touch target requirements
 * Returns array of elements that fail validation
 */
export function validateAllTouchTargets(
  container: HTMLElement = document.body
): { element: HTMLElement; width: number; height: number }[] {
  const interactiveElements = getInteractiveElements(container);
  const failures: { element: HTMLElement; width: number; height: number }[] = [];
  
  interactiveElements.forEach(element => {
    if (!validateTouchTarget(element)) {
      const rect = element.getBoundingClientRect();
      failures.push({
        element,
        width: rect.width,
        height: rect.height,
      });
    }
  });
  
  return failures;
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get responsive layout class based on viewport width
 */
export function getResponsiveClass(
  mobileClass: string,
  tabletClass: string,
  desktopClass: string
): string {
  const viewportType = getViewportType();
  
  switch (viewportType) {
    case 'mobile':
      return mobileClass;
    case 'tablet':
      return tabletClass;
    case 'desktop':
      return desktopClass;
    default:
      return desktopClass;
  }
}

/**
 * Validate that layout adapts correctly at different breakpoints
 */
export function validateResponsiveLayout(
  element: HTMLElement,
  expectedClasses: Record<Breakpoint, string[]>
): boolean {
  const width = window.innerWidth;
  const breakpoint = getBreakpoint(width);
  const expected = expectedClasses[breakpoint];
  
  if (!expected) return true;
  
  return expected.every(className => element.classList.contains(className));
}

/**
 * Test helper: Set viewport size for testing
 * Note: This only works in test environments with jsdom
 */
export function setViewportSize(width: number, height: number): void {
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  }
}

/**
 * Common viewport sizes for testing
 */
export const VIEWPORT_SIZES = {
  mobile: {
    small: { width: 320, height: 568 }, // iPhone SE
    medium: { width: 375, height: 667 }, // iPhone 8
    large: { width: 414, height: 896 }, // iPhone 11 Pro Max
  },
  tablet: {
    portrait: { width: 768, height: 1024 }, // iPad
    landscape: { width: 1024, height: 768 }, // iPad landscape
  },
  desktop: {
    small: { width: 1280, height: 720 }, // HD
    medium: { width: 1920, height: 1080 }, // Full HD
    large: { width: 2560, height: 1440 }, // 2K
  },
} as const;
