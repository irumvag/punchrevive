import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResurrectionAnimation from './ResurrectionAnimation';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Howler
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    unload: vi.fn(),
  })),
}));

// Mock Web Audio API
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    type: 'sine',
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
};

describe('ResurrectionAnimation', () => {
  const mockOnComplete = vi.fn();
  const sampleCardImage = 'data:image/png;base64,test';
  const sampleCode = 'print("Hello, World!")';

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock AudioContext
    (global as any).AudioContext = vi.fn(() => mockAudioContext);
    (global as any).webkitAudioContext = vi.fn(() => mockAudioContext);
  });

  it('renders the animation container', () => {
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={sampleCode}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText(/Channeling ancient energies/)).toBeInTheDocument();
  });

  it('displays the punch card image', () => {
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={sampleCode}
        onComplete={mockOnComplete}
      />
    );

    const image = screen.getByAltText('Punch card');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', sampleCardImage);
  });

  it('shows skip button during animation', () => {
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={sampleCode}
        onComplete={mockOnComplete}
      />
    );

    const skipButton = screen.getByText('Skip Animation →');
    expect(skipButton).toBeInTheDocument();
  });

  it('starts with lightning stage', () => {
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={sampleCode}
        onComplete={mockOnComplete}
      />
    );

    // Stage 1: Lightning should be visible initially
    expect(screen.getByText(/Channeling ancient energies/)).toBeInTheDocument();
  });

  it('skips animation when skip button is clicked', () => {
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={sampleCode}
        onComplete={mockOnComplete}
      />
    );

    const skipButton = screen.getByText('Skip Animation →');
    fireEvent.click(skipButton);

    // Should call onComplete immediately
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('creates audio context for ghost moan sound', () => {
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={sampleCode}
        onComplete={mockOnComplete}
      />
    );

    // Verify AudioContext was created
    expect(global.AudioContext || (global as any).webkitAudioContext).toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={sampleCode}
        onComplete={mockOnComplete}
      />
    );

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });

  it('handles empty code gracefully', () => {
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode=""
        onComplete={mockOnComplete}
      />
    );

    // Should still render without errors
    expect(screen.getByText(/Channeling ancient energies/)).toBeInTheDocument();
  });

  it('handles long code strings', () => {
    const longCode = 'x = 1\n'.repeat(100);
    
    render(
      <ResurrectionAnimation
        punchCardImage={sampleCardImage}
        translatedCode={longCode}
        onComplete={mockOnComplete}
      />
    );

    // Should render without errors
    expect(screen.getByText(/Channeling ancient energies/)).toBeInTheDocument();
  });
});
