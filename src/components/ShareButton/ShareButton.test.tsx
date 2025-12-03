/**
 * ShareButton Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareButton from './ShareButton';

describe('ShareButton', () => {
  const mockProps = {
    resultId: 'test-resurrection-id-123',
    punchCardPreview: 'data:image/png;base64,test',
    codeSnippet: 'print("Hello, World!")',
  };

  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });

    // Mock window.open
    vi.stubGlobal('open', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders the share button', () => {
      render(<ShareButton {...mockProps} />);
      expect(screen.getByText(/Share Resurrection/i)).toBeInTheDocument();
    });

    it('does not show share menu initially', () => {
      render(<ShareButton {...mockProps} />);
      expect(screen.queryByText(/Summon the spirits/i)).not.toBeInTheDocument();
    });

    it('shows share menu when button is clicked', () => {
      render(<ShareButton {...mockProps} />);
      const shareButton = screen.getByText(/Share Resurrection/i);
      fireEvent.click(shareButton);
      expect(screen.getByText(/Summon the spirits/i)).toBeInTheDocument();
    });

    it('hides share menu when close button is clicked', () => {
      render(<ShareButton {...mockProps} />);
      const shareButton = screen.getByText(/Share Resurrection/i);
      fireEvent.click(shareButton);
      
      const closeButton = screen.getByText(/Dismiss Spirits/i);
      fireEvent.click(closeButton);
      
      expect(screen.queryByText(/Summon the spirits/i)).not.toBeInTheDocument();
    });
  });

  describe('Share Options', () => {
    it('displays all share options when menu is open', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      expect(screen.getByText(/Copy Link/i)).toBeInTheDocument();
      expect(screen.getByText(/Twitter\/X/i)).toBeInTheDocument();
      expect(screen.getByText(/Facebook/i)).toBeInTheDocument();
      expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
    });

    it('displays the shareable URL in the input field', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const urlInput = screen.getByDisplayValue(/\/share\/test-resurrection-id-123/i);
      expect(urlInput).toBeInTheDocument();
    });
  });

  describe('Copy to Clipboard', () => {
    it('copies URL to clipboard when copy button is clicked', async () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const copyButton = screen.getByText(/Copy Link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining('/share/test-resurrection-id-123')
        );
      });
    });

    it('shows success message after copying', async () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const copyButton = screen.getByText(/Copy Link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/Link Captured!/i)).toBeInTheDocument();
      });
    });

    it('shows spooky notification after copying', async () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const copyButton = screen.getByText(/Copy Link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/The link has been captured by the spirits!/i)).toBeInTheDocument();
      });
    });

    it('handles clipboard API errors gracefully', async () => {
      // Mock clipboard failure
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(() => Promise.reject(new Error('Clipboard error'))),
        },
      });

      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const copyButton = screen.getByText(/Copy Link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('spirits failed to copy')
        );
      });

      alertSpy.mockRestore();
    });
  });

  describe('Social Media Sharing', () => {
    it('opens Twitter share window with correct URL', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        'width=600,height=400'
      );
    });

    it('includes share text in Twitter URL', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      const callArgs = (window.open as any).mock.calls[0][0];
      // URLSearchParams uses + for spaces, which is also valid encoding
      expect(callArgs).toMatch(/I[\+%20]just[\+%20]resurrected[\+%20]dead[\+%20]code/);
      expect(callArgs).toContain('%23PunchRevive');
    });

    it('opens Facebook share window with correct URL', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const facebookButton = screen.getByLabelText(/Share on Facebook/i);
      fireEvent.click(facebookButton);

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer'),
        '_blank',
        'width=600,height=400'
      );
    });

    it('opens LinkedIn share window with correct URL', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const linkedinButton = screen.getByLabelText(/Share on LinkedIn/i);
      fireEvent.click(linkedinButton);

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing'),
        '_blank',
        'width=600,height=400'
      );
    });
  });

  describe('URL Generation', () => {
    it('generates correct shareable URL format', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const urlInput = screen.getByDisplayValue(/\/share\/test-resurrection-id-123/i) as HTMLInputElement;
      expect(urlInput.value).toMatch(/\/share\/test-resurrection-id-123$/);
    });

    it('uses window.location.origin when available', () => {
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, origin: 'https://punchrevive.com' };

      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const urlInput = screen.getByDisplayValue(/https:\/\/punchrevive\.com\/share/i);
      expect(urlInput).toBeInTheDocument();

      window.location = originalLocation;
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on share button', () => {
      render(<ShareButton {...mockProps} />);
      const shareButton = screen.getByLabelText(/Share resurrection/i);
      expect(shareButton).toBeInTheDocument();
    });

    it('has proper aria-expanded state', () => {
      render(<ShareButton {...mockProps} />);
      const shareButton = screen.getByLabelText(/Share resurrection/i);
      
      expect(shareButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(shareButton);
      expect(shareButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('has proper aria-labels on social share buttons', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      expect(screen.getByLabelText(/Copy link to clipboard/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Share on Twitter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Share on Facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Share on LinkedIn/i)).toBeInTheDocument();
    });

    it('allows selecting URL text on click', () => {
      render(<ShareButton {...mockProps} />);
      fireEvent.click(screen.getByText(/Share Resurrection/i));

      const urlInput = screen.getByDisplayValue(/\/share\/test-resurrection-id-123/i) as HTMLInputElement;
      const selectSpy = vi.spyOn(urlInput, 'select');
      
      fireEvent.click(urlInput);
      expect(selectSpy).toHaveBeenCalled();
    });
  });

  describe('Responsive Behavior', () => {
    it('renders without errors on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ShareButton {...mockProps} />);
      expect(screen.getByText(/Share Resurrection/i)).toBeInTheDocument();
    });

    it('renders without errors on tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<ShareButton {...mockProps} />);
      expect(screen.getByText(/Share Resurrection/i)).toBeInTheDocument();
    });

    it('renders without errors on desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      render(<ShareButton {...mockProps} />);
      expect(screen.getByText(/Share Resurrection/i)).toBeInTheDocument();
    });
  });
});
