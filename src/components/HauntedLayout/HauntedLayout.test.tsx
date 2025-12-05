import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('renders the layout container', () => {
    const { container } = render(
      <HauntedLayout>
        <div>Content</div>
      </HauntedLayout>
    );
    
    // Check that the main container exists
    expect(container.firstChild).toBeInTheDocument();
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

    // Should have only the grass silhouette SVG (1), no cobweb SVGs
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(1);
  });

  it('renders with different glow intensities', () => {
    const { container, rerender } = render(
      <HauntedLayout glowIntensity="low">
        <div>Content</div>
      </HauntedLayout>
    );
    
    expect(container.firstChild).toBeInTheDocument();
    
    rerender(
      <HauntedLayout glowIntensity="medium">
        <div>Content</div>
      </HauntedLayout>
    );
    expect(container.firstChild).toBeInTheDocument();
    
    rerender(
      <HauntedLayout glowIntensity="high">
        <div>Content</div>
      </HauntedLayout>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('wraps content properly', () => {
    render(
      <HauntedLayout>
        <div data-testid="child">Content</div>
      </HauntedLayout>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
