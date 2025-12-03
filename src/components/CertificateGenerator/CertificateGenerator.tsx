'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { CertificateGeneratorProps } from '@/src/types/ui.types';

/**
 * CertificateGenerator - Creates downloadable resurrection certificate
 * Features blood-drip font styling with horror decorative elements
 */
export default function CertificateGenerator({
  originalLanguage,
  targetLanguage,
  resurrectionDate,
  cardId,
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Format date for certificate
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Generate and download certificate as PNG
  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);

    try {
      // Generate PNG from certificate element
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Higher resolution
        backgroundColor: '#000000',
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `resurrection-certificate-${cardId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      alert('The spirits failed to materialize the certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="certificate-generator-container">
      {/* Preview Toggle Button */}
      <button
        className="preview-button"
        onClick={() => setShowPreview(!showPreview)}
        type="button"
      >
        {showPreview ? '👻 Hide Certificate' : '📜 Preview Certificate'}
      </button>

      {/* Certificate Preview */}
      {showPreview && (
        <div className="certificate-preview">
          <div ref={certificateRef} className="certificate">
            {/* Decorative cobwebs in corners */}
            <div className="cobweb top-left">🕸️</div>
            <div className="cobweb top-right">🕸️</div>
            <div className="cobweb bottom-left">🕸️</div>
            <div className="cobweb bottom-right">🕸️</div>

            {/* Decorative skulls */}
            <div className="skull-decoration left">💀</div>
            <div className="skull-decoration right">💀</div>

            {/* Certificate border */}
            <div className="certificate-border">
              {/* Header */}
              <div className="certificate-header">
                <h1 className="certificate-title">
                  Certificate of Resurrection
                </h1>
                <div className="title-underline"></div>
              </div>

              {/* Main content */}
              <div className="certificate-body">
                <p className="proclamation">
                  This certifies that on the cursed date of
                </p>
                <p className="date-text">{formatDate(resurrectionDate)}</p>
                <p className="proclamation">
                  ancient code written in the forgotten tongue of
                </p>
                <p className="language-text">{originalLanguage}</p>
                <p className="proclamation">
                  was successfully exhumed from the digital graveyard
                  <br />
                  and resurrected into the modern realm of
                </p>
                <p className="language-text">{targetLanguage}</p>
                <p className="proclamation final">
                  May this code live again in eternal runtime.
                </p>
              </div>

              {/* Footer */}
              <div className="certificate-footer">
                <div className="seal">
                  <div className="seal-inner">
                    <div className="seal-text">⚡</div>
                    <div className="seal-label">RESURRECTED</div>
                  </div>
                </div>
                <div className="certificate-id">
                  <span className="id-label">Resurrection ID:</span>
                  <span className="id-value">{cardId}</span>
                </div>
              </div>

              {/* Decorative blood drips */}
              <div className="blood-drip drip-1"></div>
              <div className="blood-drip drip-2"></div>
              <div className="blood-drip drip-3"></div>
            </div>
          </div>
        </div>
      )}

      {/* Download Button */}
      <button
        className="download-button"
        onClick={handleDownload}
        disabled={isGenerating}
        type="button"
      >
        {isGenerating ? '⚡ Materializing...' : '💾 Download Certificate'}
      </button>

      <style jsx>{`
        .certificate-generator-container {
          width: 100%;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .preview-button,
        .download-button {
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
          /* Ensure minimum touch target size */
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
        }

        .preview-button:hover,
        .download-button:hover:not(:disabled) {
          background: #0f0;
          color: #000000;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
          transform: translateY(-2px);
        }

        .preview-button:active,
        .download-button:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }

        .download-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .certificate-preview {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: #001100;
          border: 1px solid #003300;
          border-radius: 8px;
        }

        .certificate {
          width: 800px;
          min-height: 600px;
          background: #000000;
          padding: 3rem;
          position: relative;
          border: 4px solid #0f0;
          box-shadow: 
            0 0 30px rgba(0, 255, 0, 0.4),
            inset 0 0 50px rgba(0, 255, 0, 0.1);
        }

        /* Decorative cobwebs */
        .cobweb {
          position: absolute;
          font-size: 2rem;
          opacity: 0.3;
          animation: float 6s ease-in-out infinite;
        }

        .cobweb.top-left {
          top: 1rem;
          left: 1rem;
        }

        .cobweb.top-right {
          top: 1rem;
          right: 1rem;
          animation-delay: 1s;
        }

        .cobweb.bottom-left {
          bottom: 1rem;
          left: 1rem;
          animation-delay: 2s;
        }

        .cobweb.bottom-right {
          bottom: 1rem;
          right: 1rem;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Decorative skulls */
        .skull-decoration {
          position: absolute;
          font-size: 3rem;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.2;
          animation: pulse 3s ease-in-out infinite;
        }

        .skull-decoration.left {
          left: 0.5rem;
        }

        .skull-decoration.right {
          right: 0.5rem;
          animation-delay: 1.5s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: translateY(-50%) scale(1);
          }
          50% {
            opacity: 0.4;
            transform: translateY(-50%) scale(1.1);
          }
        }

        .certificate-border {
          border: 2px solid #003300;
          padding: 2rem;
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(0, 255, 0, 0.02) 0%,
            transparent 50%,
            rgba(0, 255, 0, 0.02) 100%
          );
        }

        /* Header */
        .certificate-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .certificate-title {
          font-family: 'Creepster', cursive;
          font-size: 3rem;
          color: #0f0;
          margin: 0;
          text-shadow: 
            0 0 20px rgba(0, 255, 0, 0.8),
            0 2px 0 #003300;
          letter-spacing: 3px;
          line-height: 1.2;
        }

        .title-underline {
          width: 60%;
          height: 3px;
          background: linear-gradient(
            to right,
            transparent,
            #0f0,
            transparent
          );
          margin: 1rem auto;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
        }

        /* Body */
        .certificate-body {
          text-align: center;
          margin-bottom: 3rem;
        }

        .proclamation {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          color: #003300;
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .proclamation.final {
          margin-top: 2rem;
          font-style: italic;
          color: #0f0;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        }

        .date-text,
        .language-text {
          font-family: 'Creepster', cursive;
          font-size: 1.8rem;
          color: #0f0;
          margin: 1rem 0;
          text-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
          letter-spacing: 2px;
        }

        /* Footer */
        .certificate-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #003300;
        }

        .seal {
          width: 100px;
          height: 100px;
          border: 3px solid #0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            circle,
            rgba(0, 255, 0, 0.1) 0%,
            transparent 70%
          );
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .seal-inner {
          text-align: center;
        }

        .seal-text {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .seal-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          color: #0f0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .certificate-id {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #003300;
          text-align: right;
        }

        .id-label {
          display: block;
          margin-bottom: 0.25rem;
          color: #0f0;
        }

        .id-value {
          display: block;
          font-size: 0.65rem;
          word-break: break-all;
          max-width: 200px;
        }

        /* Blood drips */
        .blood-drip {
          position: absolute;
          width: 10px;
          height: 30px;
          background: linear-gradient(to bottom, #0f0, transparent);
          opacity: 0.3;
          border-radius: 0 0 50% 50%;
        }

        .blood-drip.drip-1 {
          top: 0;
          left: 30%;
          animation: drip 4s ease-in-out infinite;
        }

        .blood-drip.drip-2 {
          top: 0;
          left: 50%;
          animation: drip 4s ease-in-out infinite 1s;
        }

        .blood-drip.drip-3 {
          top: 0;
          left: 70%;
          animation: drip 4s ease-in-out infinite 2s;
        }

        @keyframes drip {
          0%, 100% {
            height: 30px;
            opacity: 0.3;
          }
          50% {
            height: 50px;
            opacity: 0.5;
          }
        }

        /* Responsive design */
        @media (max-width: 1024px) {
          .certificate {
            width: 700px;
            padding: 2rem;
          }

          .certificate-title {
            font-size: 2.5rem;
          }

          .date-text,
          .language-text {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .certificate-preview {
            padding: 1rem;
          }

          .certificate {
            width: 100%;
            max-width: 600px;
            padding: 1.5rem;
            min-height: 500px;
          }

          .certificate-title {
            font-size: 2rem;
          }

          .proclamation {
            font-size: 0.9rem;
          }

          .date-text,
          .language-text {
            font-size: 1.3rem;
          }

          .certificate-footer {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }

          .certificate-id {
            text-align: center;
          }

          .id-value {
            max-width: 100%;
          }

          .skull-decoration {
            font-size: 2rem;
          }

          .seal {
            width: 80px;
            height: 80px;
          }

          .seal-text {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .certificate {
            padding: 1rem;
            min-height: 450px;
          }

          .certificate-border {
            padding: 1rem;
          }

          .certificate-title {
            font-size: 1.5rem;
            letter-spacing: 1px;
          }

          .proclamation {
            font-size: 0.8rem;
          }

          .date-text,
          .language-text {
            font-size: 1.1rem;
          }

          .preview-button,
          .download-button {
            font-size: 0.85rem;
            padding: 0.6rem 1.5rem;
          }

          .cobweb {
            font-size: 1.5rem;
          }

          .skull-decoration {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
