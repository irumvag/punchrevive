import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UploadZone from './UploadZone';

describe('UploadZone Component', () => {
  const mockOnUpload = vi.fn();
  const defaultProps = {
    onUpload: mockOnUpload,
    acceptedFormats: ['png', 'jpeg', 'webp'],
    maxSizeMB: 10,
  };

  beforeEach(() => {
    mockOnUpload.mockClear();
  });

  it('renders upload zone with correct text', () => {
    render(<UploadZone {...defaultProps} />);
    
    expect(screen.getByText(/drag & drop your punch card photo here/i)).toBeInTheDocument();
    expect(screen.getByText(/accepted formats: png, jpeg, webp/i)).toBeInTheDocument();
  });

  it('renders upload icon', () => {
    const { container } = render(<UploadZone {...defaultProps} />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-toxic-green');
  });

  it('has file input with correct accept attributes', () => {
    const { container } = render(<UploadZone {...defaultProps} />);
    const input = container.querySelector('input[type="file"]');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('accept');
  });

  it('shows camera capture button on mobile devices', () => {
    // Mock mobile user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    
    render(<UploadZone {...defaultProps} />);
    
    expect(screen.getByText(/capture with camera/i)).toBeInTheDocument();
  });

  it('camera capture input has correct attributes', () => {
    // Mock mobile user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    
    render(<UploadZone {...defaultProps} />);
    
    const cameraInput = screen.getByLabelText(/capture with camera/i);
    expect(cameraInput).toHaveAttribute('accept', 'image/*');
    expect(cameraInput).toHaveAttribute('capture', 'environment');
  });

  it('displays correct max file size in text', () => {
    render(<UploadZone {...defaultProps} />);
    
    expect(screen.getByText(/max 10MB/i)).toBeInTheDocument();
  });

  it('applies haunted theme colors', () => {
    const { container } = render(<UploadZone {...defaultProps} />);
    const dropzone = container.querySelector('[role="presentation"]');
    
    expect(dropzone).toHaveClass('border-dark-green');
    expect(dropzone).toHaveClass('hover:border-toxic-green/70');
  });
});
