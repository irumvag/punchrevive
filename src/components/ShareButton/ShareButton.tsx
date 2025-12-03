'use client';

import { useState } from 'react';
import type { ShareButtonProps } from '@/src/types/ui.types';

/**
 * ShareButton - Generates shareable links and social media cards
 * Features copy-to-clipboard with spooky confirmation and social sharing options
 */
export default function ShareButton({
  resultId,
  punchCardPreview,
  codeSnippet,
}: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate the shareable URL
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/share/${resultId}`;

  // Social media share text
  const shareText = 'I just resurrected dead code #PunchRevive';

  // Copy URL to clipboard with spooky confirmation
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('The spirits failed to copy the link. Please try again.');
    }
  };

  // Generate Twitter/X share URL
  const getTwitterShareUrl = (): string => {
    const params = new URLSearchParams({
      text: shareText,
      url: shareUrl,
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  };

  // Generate Facebook share URL
  const getFacebookShareUrl = (): string => {
    const params = new URLSearchParams({
      u: shareUrl,
    });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  };

  // Generate LinkedIn share URL
  const getLinkedInShareUrl = (): string => {
    const params = new URLSearchParams({
      url: shareUrl,
    });
    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
  };

  // Open share URL in new window
  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="share-button-container">
      {/* Main Share Button */}
      <button
        className="share-button"
        onClick={() => setShowShareMenu(!showShareMenu)}
        type="button"
        aria-label="Share resurrection"
        aria-expanded={showShareMenu}
      >
        👻 Share Resurrection
      </button>

      {/* Share Menu */}
      {showShareMenu && (
        <div className="share-menu">
          <div className="share-menu-header">
            <h3>Summon the spirits to spread the word...</h3>
          </div>

          <div className="share-options">
            {/* Copy Link Option */}
            <button
              className="share-option copy-option"
              onClick={handleCopyToClipboard}
              type="button"
              aria-label="Copy link to clipboard"
            >
              <span className="option-icon">📋</span>
              <span className="option-label">
                {copySuccess ? '✨ Link Captured!' : 'Copy Link'}
              </span>
            </button>

            {/* Twitter/X Option */}
            <button
              className="share-option twitter-option"
              onClick={() => openShareWindow(getTwitterShareUrl())}
              type="button"
              aria-label="Share on Twitter"
            >
              <span className="option-icon">𝕏</span>
              <span className="option-label">Twitter/X</span>
            </button>

            {/* Facebook Option */}
            <button
              className="share-option facebook-option"
              onClick={() => openShareWindow(getFacebookShareUrl())}
              type="button"
              aria-label="Share on Facebook"
            >
              <span className="option-icon">f</span>
              <span className="option-label">Facebook</span>
            </button>

            {/* LinkedIn Option */}
            <button
              className="share-option linkedin-option"
              onClick={() => openShareWindow(getLinkedInShareUrl())}
              type="button"
              aria-label="Share on LinkedIn"
            >
              <span className="option-icon">in</span>
              <span className="option-label">LinkedIn</span>
            </button>
          </div>

          {/* Shareable URL Display */}
          <div className="share-url-display">
            <label htmlFor="share-url-input" className="url-label">
              Shareable Link:
            </label>
            <input
              id="share-url-input"
              type="text"
              value={shareUrl}
              readOnly
              className="url-input"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>

          {/* Close Button */}
          <button
            className="close-menu-button"
            onClick={() => setShowShareMenu(false)}
            type="button"
            aria-label="Close share menu"
          >
            ✕ Dismiss Spirits
          </button>
        </div>
      )}

      {/* Copy Success Notification */}
      {copySuccess && (
        <div className="copy-notification">
          <span className="notification-icon">👻</span>
          <span className="notification-text">
            The link has been captured by the spirits!
          </span>
        </div>
      )}

      <style jsx>{`
        .share-button-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 1rem auto;
        }

        .share-button {
          width: 100%;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          color: #0f0;
          background: #000000;
          border: 2px solid #0f0;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
        }

        .share-button:hover {
          background: #0f0;
          color: #000000;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
          transform: translateY(-2px);
        }

        .share-menu {
          position: absolute;
          top: calc(100% + 1rem);
          left: 0;
          right: 0;
          background: #000000;
          border: 2px solid #0f0;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 
            0 0 30px rgba(0, 255, 0, 0.4),
            inset 0 0 20px rgba(0, 255, 0, 0.1);
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .share-menu-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .share-menu-header h3 {
          font-family: 'Creepster', cursive;
          font-size: 1.2rem;
          color: #0f0;
          margin: 0;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
          letter-spacing: 1px;
        }

        .share-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .share-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: #0f0;
          background: #001100;
          border: 1px solid #003300;
          padding: 1rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 80px;
        }

        .share-option:hover {
          background: #003300;
          border-color: #0f0;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
          transform: translateY(-2px);
        }

        .option-icon {
          font-size: 1.5rem;
          display: block;
        }

        .option-label {
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.75rem;
        }

        .copy-option.share-option:hover {
          background: #0f0;
          color: #000000;
        }

        .share-url-display {
          margin-bottom: 1rem;
        }

        .url-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #003300;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .url-input {
          width: 100%;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #0f0;
          background: #001100;
          border: 1px solid #003300;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .url-input:focus {
          outline: none;
          border-color: #0f0;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
        }

        .close-menu-button {
          width: 100%;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: #003300;
          background: transparent;
          border: 1px solid #003300;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .close-menu-button:hover {
          color: #0f0;
          border-color: #0f0;
        }

        .copy-notification {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          color: #0f0;
          background: #000000;
          border: 2px solid #0f0;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.6);
          z-index: 2000;
          animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.7s;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .notification-icon {
          font-size: 1.5rem;
          animation: float 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .notification-text {
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .share-button-container {
            max-width: 100%;
          }

          .share-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            right: auto;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 400px;
          }

          .share-options {
            grid-template-columns: 1fr;
          }

          .copy-notification {
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
            transform: none;
            max-width: calc(100% - 2rem);
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        @media (max-width: 480px) {
          .share-button {
            font-size: 0.85rem;
            padding: 0.6rem 1.5rem;
          }

          .share-menu-header h3 {
            font-size: 1rem;
          }

          .share-option {
            min-height: 70px;
            padding: 0.75rem 0.5rem;
          }

          .option-icon {
            font-size: 1.25rem;
          }

          .option-label {
            font-size: 0.7rem;
          }

          .copy-notification {
            font-size: 0.8rem;
            padding: 0.75rem 1rem;
          }

          .notification-icon {
            font-size: 1.25rem;
          }
        }

        /* Touch target minimum size for mobile */
        @media (max-width: 768px) {
          .share-button,
          .share-option,
          .close-menu-button {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </div>
  );
}
