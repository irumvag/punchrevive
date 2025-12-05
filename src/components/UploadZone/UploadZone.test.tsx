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
    
    expect(screen.getByText(/drop your punch card here/i)).toBeInTheDocument();
    expect(screen.getByText(/PNG/)).toBeInTheDocument();
    expect(screen.getByText(/JPEG/)).toBeInTheDocument();
  });

  it('has file input element', () => {
    const { container } = render(<UploadZone {...defaultProps} />);
    const input = container.querySelector('input[type="file"]');
    
    expect(input).toBeInTheDocument();
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

  it('displays correct max file size in text', () => {
    render(<UploadZone {...defaultProps} />);
    
    expect(screen.getByText(/max 10MB/i)).toBeInTheDocument();
  });

  it('renders dropzone container', () => {
    const { container } = render(<UploadZone {...defaultProps} />);
    const dropzone = container.querySelector('.dropzone');
    
    expect(dropzone).toBeInTheDocument();
  });
});
