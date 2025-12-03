'use client';

import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import type { CodeDisplayProps } from '@/src/types/ui.types';

/**
 * CodeDisplay - Shows original and translated code in retro terminal style
 * Features side-by-side comparison with syntax highlighting and CRT effects
 */
export default function CodeDisplay({
  originalCode,
  originalLanguage,
  translatedCode,
  targetLanguage,
  exorcismReport,
}: CodeDisplayProps) {
  const originalCodeRef = useRef<HTMLElement>(null);
  const translatedCodeRef = useRef<HTMLElement>(null);
  const [showFlicker, setShowFlicker] = useState(true);

  // Apply syntax highlighting when code changes
  useEffect(() => {
    if (originalCodeRef.current) {
      Prism.highlightElement(originalCodeRef.current);
    }
    if (translatedCodeRef.current) {
      Prism.highlightElement(translatedCodeRef.current);
    }
  }, [originalCode, translatedCode]);

  // CRT flicker effect on mount
  useEffect(() => {
    const flickerTimer = setTimeout(() => {
      setShowFlicker(false);
    }, 2000);

    return () => clearTimeout(flickerTimer);
  }, []);

  // Get language identifier for Prism
  const getLanguageClass = (lang: string): string => {
    if (lang === 'Python') return 'language-python';
    if (lang === 'JavaScript') return 'language-javascript';
    // For legacy languages, use plain text
    return 'language-none';
  };

  // Split code into lines for line numbers
  const getLines = (code: string): string[] => {
    return code.split('\n');
  };

  return (
    <div className={`code-display-container ${showFlicker ? 'flicker' : ''}`}>
      {/* Header */}
      <div className="code-display-header">
        <h2 className="code-display-title">Code Resurrection Complete</h2>
        <p className="code-display-subtitle">
          Ancient code brought back to life
        </p>
      </div>

      {/* Side-by-side code panels */}
      <div className="code-panels">
        {/* Original Code Panel */}
        <div className="code-panel original-panel">
          <div className="panel-header">
            <h3 className="panel-title">Original Code</h3>
            <span className="language-badge">{originalLanguage}</span>
          </div>
          <div className="code-wrapper">
            <div className="line-numbers">
              {getLines(originalCode).map((_, index) => (
                <div key={index} className="line-number">
                  {index + 1}
                </div>
              ))}
            </div>
            <pre className="code-block">
              <code
                ref={originalCodeRef}
                className={getLanguageClass(originalLanguage)}
              >
                {originalCode}
              </code>
            </pre>
          </div>
        </div>

        {/* Translated Code Panel */}
        <div className="code-panel translated-panel">
          <div className="panel-header">
            <h3 className="panel-title">Resurrected Code</h3>
            <span className="language-badge modern">{targetLanguage}</span>
          </div>
          <div className="code-wrapper">
            <div className="line-numbers">
              {getLines(translatedCode).map((_, index) => (
                <div key={index} className="line-number">
                  {index + 1}
                </div>
              ))}
            </div>
            <pre className="code-block">
              <code
                ref={translatedCodeRef}
                className={getLanguageClass(targetLanguage)}
              >
                {translatedCode}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Bug fixes summary */}
      {exorcismReport.length > 0 && (
        <div className="bugs-summary">
          <span className="bugs-count">
            {exorcismReport.length} demon{exorcismReport.length !== 1 ? 's' : ''} exorcised
          </span>
        </div>
      )}

      <style jsx>{`
        .code-display-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 2rem;
          background: #000000;
          border: 2px solid #0f0;
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
          position: relative;
        }

        /* CRT flicker effect */
        .code-display-container.flicker {
          animation: crt-flicker 0.15s infinite;
        }

        @keyframes crt-flicker {
          0% { opacity: 1; }
          10% { opacity: 0.95; }
          20% { opacity: 1; }
          30% { opacity: 0.98; }
          40% { opacity: 1; }
          50% { opacity: 0.97; }
          60% { opacity: 1; }
          70% { opacity: 0.99; }
          80% { opacity: 1; }
          90% { opacity: 0.96; }
          100% { opacity: 1; }
        }

        /* Scanline effect overlay */
        .code-display-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 1;
        }

        .code-display-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .code-display-title {
          font-family: 'Creepster', cursive;
          font-size: 2.5rem;
          color: #0f0;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
        }

        .code-display-subtitle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          color: #003300;
          margin: 0;
        }

        .code-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .code-panel {
          background: #001100;
          border: 1px solid #003300;
          border-radius: 4px;
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #000000;
          border-bottom: 1px solid #003300;
        }

        .panel-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          color: #0f0;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .language-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #003300;
          background: #000000;
          padding: 0.25rem 0.75rem;
          border: 1px solid #003300;
          border-radius: 3px;
          text-transform: uppercase;
        }

        .language-badge.modern {
          color: #0f0;
          border-color: #0f0;
          box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
        }

        .code-wrapper {
          display: flex;
          overflow-x: auto;
          max-height: 600px;
          overflow-y: auto;
        }

        .line-numbers {
          flex-shrink: 0;
          padding: 1rem 0;
          background: #000000;
          border-right: 1px solid #003300;
          user-select: none;
        }

        .line-number {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: #003300;
          text-align: right;
          padding: 0 0.75rem;
          line-height: 1.5;
          min-width: 3rem;
        }

        .code-block {
          flex: 1;
          margin: 0;
          padding: 1rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #0f0;
          background: transparent;
          overflow: visible;
        }

        .code-block code {
          font-family: 'IBM Plex Mono', monospace;
          color: #0f0;
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }

        /* Prism syntax highlighting overrides for haunted theme */
        .code-block :global(.token.comment),
        .code-block :global(.token.prolog),
        .code-block :global(.token.doctype),
        .code-block :global(.token.cdata) {
          color: #003300;
        }

        .code-block :global(.token.punctuation) {
          color: #0f0;
        }

        .code-block :global(.token.property),
        .code-block :global(.token.tag),
        .code-block :global(.token.boolean),
        .code-block :global(.token.number),
        .code-block :global(.token.constant),
        .code-block :global(.token.symbol),
        .code-block :global(.token.deleted) {
          color: #00ff00;
        }

        .code-block :global(.token.selector),
        .code-block :global(.token.attr-name),
        .code-block :global(.token.string),
        .code-block :global(.token.char),
        .code-block :global(.token.builtin),
        .code-block :global(.token.inserted) {
          color: #0f0;
        }

        .code-block :global(.token.operator),
        .code-block :global(.token.entity),
        .code-block :global(.token.url),
        .code-block :global(.language-css .token.string),
        .code-block :global(.style .token.string) {
          color: #00ff00;
        }

        .code-block :global(.token.atrule),
        .code-block :global(.token.attr-value),
        .code-block :global(.token.keyword) {
          color: #0f0;
          font-weight: bold;
        }

        .code-block :global(.token.function),
        .code-block :global(.token.class-name) {
          color: #00ff00;
          text-shadow: 0 0 8px rgba(0, 255, 0, 0.6);
        }

        .code-block :global(.token.regex),
        .code-block :global(.token.important),
        .code-block :global(.token.variable) {
          color: #0f0;
        }

        .bugs-summary {
          text-align: center;
          padding: 1rem;
          background: #001100;
          border: 1px solid #003300;
          border-radius: 4px;
          position: relative;
          z-index: 2;
        }

        .bugs-count {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          color: #0f0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Responsive design */
        @media (max-width: 1024px) {
          .code-panels {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .code-display-container {
            padding: 1rem;
          }

          .code-display-title {
            font-size: 1.8rem;
          }

          .code-block {
            font-size: 0.75rem;
          }

          .line-number {
            font-size: 0.75rem;
            padding: 0 0.5rem;
            min-width: 2.5rem;
          }

          .code-wrapper {
            max-height: 400px;
          }
        }

        @media (max-width: 480px) {
          .code-display-title {
            font-size: 1.5rem;
          }

          .panel-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .code-block {
            font-size: 0.7rem;
            padding: 0.75rem;
          }
        }

        /* Scrollbar styling for haunted theme */
        .code-wrapper::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-wrapper::-webkit-scrollbar-track {
          background: #000000;
        }

        .code-wrapper::-webkit-scrollbar-thumb {
          background: #003300;
          border-radius: 4px;
        }

        .code-wrapper::-webkit-scrollbar-thumb:hover {
          background: #0f0;
        }
      `}</style>
    </div>
  );
}
