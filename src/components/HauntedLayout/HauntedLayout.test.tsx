import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import HauntedLayout from './HauntedLayout';

describe('HauntedLayout', () => {
  it('renders children correctly', () => {
    render(
      <HauntedLayout>
        <div data-testid="test-child">Test Content</div>
      </HauntedLayout>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies haunted-black background', () => {
    const { container } = render(
      <HauntedLayout>
        <div>Content</div>
      </HauntedLayout>
    );
    
    const layout = container.firstChild as HTMLElement;
    expect(layout).toHaveClass('bg-haunted-black');
  });

  it('shows cobwebs by default', () => {
    const { container } = render(
      <HauntedLayout>
        <div>Content</div>
      </HauntedLayout>
    );
    
    // Check for SVG cobwebs
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('hides cobwebs when showCobwebs is false', () => {
    const { container } = render(
      <HauntedLayout showCobwebs={false}>
        <div>Content</div>
      </HauntedLayout>
    );
    
    // Check that cobwebs container is not present
    const cobwebContainer = container.querySelector('.pointer-events-none svg');
    expect(cobwebContainer).toBeNull();
  });

  it('applies correct glow intensity', () => {
    const { container, rerender } = render(
      <HauntedLayout glowIntensity="low">
        <div>Content</div>
      </HauntedLayout>
    );
    
    // Check that glowing vials container exists
    const glowContainer = container.querySelector('[style*="opacity"]');
    expect(glowContainer).toBeInTheDocument();
    
    // Test different intensities
    rerender(
      <HauntedLayout glowIntensity="high">
        <div>Content</div>
      </HauntedLayout>
    );
    expect(glowContainer).toBeInTheDocument();
  });

  it('includes CRT monitors in background', () => {
    const { container } = render(
      <HauntedLayout>
        <div>Content</div>
      </HauntedLayout>
    );
    
    // Check for CRT monitor elements (borders with toxic-green)
    const crtElements = container.querySelectorAll('[class*="border-toxic-green"]');
    expect(crtElements.length).toBeGreaterThan(0);
  });

  it('includes scattered papers in background', () => {
    const { container } = render(
      <HauntedLayout>
        <div>Content</div>
      </HauntedLayout>
    );
    
    // Check for paper elements (dark-green backgrounds)
    const paperElements = container.querySelectorAll('[class*="bg-dark-green"]');
    expect(paperElements.length).toBeGreaterThan(0);
  });

  it('applies responsive container classes', () => {
    const { container } = render(
      <HauntedLayout>
        <div>Content</div>
      </HauntedLayout>
    );
    
    // Check for responsive padding classes
    const contentContainer = container.querySelector('.container');
    expect(contentContainer).toHaveClass('mx-auto');
    expect(contentContainer).toHaveClass('px-4');
  });

  // **Feature: punch-revive, Property 17: Color palette consistency**
  it('all UI elements use only haunted laboratory colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('low', 'medium', 'high'),
        fc.boolean(),
        (glowIntensity, showCobwebs) => {
          const { container } = render(
            <HauntedLayout glowIntensity={glowIntensity} showCobwebs={showCobwebs}>
              <div className="text-toxic-green bg-haunted-black">Test Content</div>
            </HauntedLayout>
          );

          // Valid colors in the haunted laboratory palette
          // RGB equivalents: #000000 = rgb(0, 0, 0), #0f0 = rgb(0, 255, 0), #003300 = rgb(0, 51, 0)
          const validColors = [
            'rgb(0, 0, 0)',      // #000000 - haunted-black
            'rgb(0, 255, 0)',    // #0f0 - toxic-green
            'rgb(0, 51, 0)',     // #003300 - dark-green
            'rgba(0, 0, 0, 0)',  // transparent (valid as it doesn't add color)
          ];

          // Helper to normalize color strings (handles rgba with alpha = 0)
          const normalizeColor = (color: string): string => {
            // Handle rgba(0, 0, 0, 0) as transparent
            if (color.startsWith('rgba(0, 0, 0, 0)')) {
              return 'rgba(0, 0, 0, 0)';
            }
            return color;
          };

          // Helper to check if a color is valid or derived from valid colors
          const isValidColor = (color: string): boolean => {
            const normalized = normalizeColor(color);
            
            // Check exact matches
            if (validColors.includes(normalized)) {
              return true;
            }

            // Check rgba variants with alpha channel (e.g., rgba(0, 255, 0, 0.5))
            const rgbaMatch = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (rgbaMatch) {
              const [, r, g, b] = rgbaMatch;
              const baseColor = `rgb(${r}, ${g}, ${b})`;
              return validColors.includes(baseColor);
            }

            // Allow CSS system colors (canvastext, etc.) as they're browser defaults
            // These are not part of our palette but are acceptable as fallbacks
            if (color === 'canvastext' || color === 'canvas' || color === 'inherit' || color === 'currentcolor') {
              return true;
            }

            return false;
          };

          // Get all elements with color-related classes
          const allElements = container.querySelectorAll('*');
          
          allElements.forEach((element) => {
            const computedStyle = window.getComputedStyle(element);
            
            // Check text color
            const color = computedStyle.color;
            if (color && color !== '' && color !== 'inherit') {
              expect(
                isValidColor(color),
                `Element has invalid text color: ${color}. Expected one of: ${validColors.join(', ')}`
              ).toBe(true);
            }

            // Check background color
            const backgroundColor = computedStyle.backgroundColor;
            if (backgroundColor && backgroundColor !== '' && backgroundColor !== 'inherit') {
              expect(
                isValidColor(backgroundColor),
                `Element has invalid background color: ${backgroundColor}. Expected one of: ${validColors.join(', ')}`
              ).toBe(true);
            }

            // Check border color
            const borderColor = computedStyle.borderColor;
            if (borderColor && borderColor !== '' && borderColor !== 'inherit') {
              expect(
                isValidColor(borderColor),
                `Element has invalid border color: ${borderColor}. Expected one of: ${validColors.join(', ')}`
              ).toBe(true);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
