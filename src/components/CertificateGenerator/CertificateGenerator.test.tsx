import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CertificateGenerator from './CertificateGenerator';
import * as htmlToImage from 'html-to-image';

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}));

describe('CertificateGenerator', () => {
  const mockProps = {
    originalLanguage: 'FORTRAN',
    targetLanguage: 'Python',
    resurrectionDate: new Date('2024-10-31'),
    cardId: 'test-card-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders preview button', () => {
    render(<CertificateGenerator {...mockProps} />);
    expect(screen.getByText(/Preview Certificate/i)).toBeInTheDocument();
  });

  it('renders download button', () => {
    render(<CertificateGenerator {...mockProps} />);
    expect(screen.getByText(/Download Certificate/i)).toBeInTheDocument();
  });

  it('shows certificate when preview button is clicked', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    expect(screen.getByText(/Certificate of Resurrection/i)).toBeInTheDocument();
  });

  it('hides certificate when hide button is clicked', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    // Show certificate
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);
    expect(screen.getByText(/Certificate of Resurrection/i)).toBeInTheDocument();

    // Hide certificate
    const hideButton = screen.getByText(/Hide Certificate/i);
    fireEvent.click(hideButton);
    expect(screen.queryByText(/Certificate of Resurrection/i)).not.toBeInTheDocument();
  });

  it('displays original language in certificate', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    expect(screen.getByText('FORTRAN')).toBeInTheDocument();
  });

  it('displays target language in certificate', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('displays formatted resurrection date', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    expect(screen.getByText(/October 31, 2024/i)).toBeInTheDocument();
  });

  it('displays card ID in certificate', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    expect(screen.getByText('test-card-123')).toBeInTheDocument();
  });

  it('download button is not disabled initially', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    const downloadButton = screen.getByText(/Download Certificate/i);
    expect(downloadButton).not.toBeDisabled();
  });

  it('certificate content is available for PNG generation', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    // Show preview first
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    // Verify certificate content exists
    const certificate = screen.getByText(/Certificate of Resurrection/i);
    expect(certificate).toBeInTheDocument();
    
    // Verify all required content is present for PNG generation
    expect(screen.getByText('FORTRAN')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText(/October 31, 2024/i)).toBeInTheDocument();
    expect(screen.getByText('test-card-123')).toBeInTheDocument();
  });

  it('includes decorative elements in certificate', () => {
    render(<CertificateGenerator {...mockProps} />);
    
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    // Check for cobwebs (🕸️)
    const certificate = screen.getByText(/Certificate of Resurrection/i).closest('.certificate');
    expect(certificate).toBeInTheDocument();
    
    // Certificate should contain decorative elements
    expect(certificate?.textContent).toContain('🕸️');
    expect(certificate?.textContent).toContain('💀');
  });

  it('formats date correctly for different dates', () => {
    const customDate = new Date('2023-12-25');
    render(<CertificateGenerator {...mockProps} resurrectionDate={customDate} />);
    
    const previewButton = screen.getByText(/Preview Certificate/i);
    fireEvent.click(previewButton);

    expect(screen.getByText(/December 25, 2023/i)).toBeInTheDocument();
  });
});
