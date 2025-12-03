'use client';

import { useState, useEffect } from 'react';
import type { ExorcismReportProps } from '@/src/types/ui.types';
import type { BugFix } from '@/src/types/punch-card.types';

/**
 * ExorcismReport - Displays bugs found and fixed with spooky terminology
 * Features blood-drip styled list with ghost effect animations
 */
export default function ExorcismReport({ fixes }: ExorcismReportProps) {
  const [visibleFixes, setVisibleFixes] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Animate each fix reveal with ghost effect
  useEffect(() => {
    if (fixes.length === 0) {
      setIsAnimating(false);
      return;
    }

    // Reveal fixes one by one
    const revealInterval = setInterval(() => {
      setVisibleFixes((prev) => {
        if (prev >= fixes.length) {
          clearInterval(revealInterval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 300); // 300ms delay between each fix reveal

    return () => clearInterval(revealInterval);
  }, [fixes.length]);

  // Get severity icon
  const getSeverityIcon = (severity: BugFix['severity']): string => {
    switch (severity) {
      case 'critical':
        return '🧛';
      case 'warning':
        return '👻';
      case 'info':
        return '🕷️';
      default:
        return '💀';
    }
  };

  // Get severity color class
  const getSeverityClass = (severity: BugFix['severity']): string => {
    switch (severity) {
      case 'critical':
        return 'severity-critical';
      case 'warning':
        return 'severity-warning';
      case 'info':
        return 'severity-info';
      default:
        return '';
    }
  };

  return (
    <div className="exorcism-report-container">
      {/* Header */}
      <div className="report-header">
        <h2 className="report-title">🧛 Exorcism Report 🧛</h2>
        {fixes.length > 0 ? (
          <p className="report-subtitle">
            {fixes.length} curse{fixes.length === 1 ? '' : 's'} banished from the ancient code
          </p>
        ) : (
          <p className="report-subtitle pure">
            ✨ No demons detected - code is pure ✨
          </p>
        )}
      </div>

      {/* Bug fixes list */}
      {fixes.length > 0 && (
        <div className="fixes-list">
          {fixes.map((fix, index) => (
            <div
              key={fix.id}
              className={`fix-item ${index < visibleFixes ? 'visible' : 'hidden'} ${getSeverityClass(fix.severity)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Fix number and spooky message */}
              <div className="fix-header">
                <span className="fix-number">{index + 1}.</span>
                <span className="severity-icon">{getSeverityIcon(fix.severity)}</span>
                <h3 className="spooky-message">{fix.spookyMessage}</h3>
              </div>

              {/* Location */}
              <div className="fix-location">
                <span className="location-label">Location:</span>
                <span className="location-value">
                  Line {fix.location.line}, Column {fix.location.column}
                </span>
              </div>

              {/* Code snippet */}
              {fix.location.snippet && (
                <div className="code-snippet">
                  <pre>
                    <code>{fix.location.snippet}</code>
                  </pre>
                </div>
              )}

              {/* Description */}
              <div className="fix-description">
                <p>{fix.description}</p>
              </div>

              {/* Fix applied */}
              <div className="fix-applied">
                <span className="fix-label">Exorcism:</span>
                <span className="fix-value">{fix.fix}</span>
              </div>

              {/* Blood drip decoration */}
              <div className="blood-drip"></div>
            </div>
          ))}
        </div>
      )}

      {/* Footer message */}
      {fixes.length > 0 && !isAnimating && (
        <div className="report-footer">
          <p className="footer-message">
            ⚡ The code has been purified and is ready for resurrection! ⚡
          </p>
        </div>
      )}

      <style jsx>{`
        .exorcism-report-container {
          width: 100%;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
          background: #000000;
          border: 2px solid #0f0;
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
          position: relative;
        }

        /* Scanline effect overlay */
        .exorcism-report-container::before {
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

        .report-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .report-title {
          font-family: 'Creepster', cursive;
          font-size: 2.5rem;
          color: #0f0;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
          letter-spacing: 2px;
        }

        .report-subtitle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          color: #0f0;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .report-subtitle.pure {
          font-size: 1.2rem;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
          }
          50% {
            text-shadow: 0 0 20px rgba(0, 255, 0, 0.9);
          }
        }

        .fixes-list {
          position: relative;
          z-index: 2;
        }

        .fix-item {
          background: #001100;
          border: 1px solid #003300;
          border-radius: 4px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .fix-item.visible {
          opacity: 1;
          transform: translateY(0);
          animation: ghost-reveal 0.5s ease-out;
        }

        @keyframes ghost-reveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .fix-item.hidden {
          opacity: 0;
          transform: translateY(20px);
        }

        /* Severity-based styling */
        .fix-item.severity-critical {
          border-color: #ff0000;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
        }

        .fix-item.severity-warning {
          border-color: #ffaa00;
          box-shadow: 0 0 10px rgba(255, 170, 0, 0.2);
        }

        .fix-item.severity-info {
          border-color: #003300;
        }

        .fix-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .fix-number {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.5rem;
          color: #0f0;
          font-weight: bold;
          min-width: 2rem;
        }

        .severity-icon {
          font-size: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .spooky-message {
          font-family: 'Creepster', cursive;
          font-size: 1.5rem;
          color: #0f0;
          margin: 0;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
          flex: 1;
        }

        .fix-location {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: #003300;
          margin-bottom: 0.75rem;
          padding-left: 2.75rem;
        }

        .location-label {
          color: #0f0;
          margin-right: 0.5rem;
        }

        .location-value {
          color: #003300;
        }

        .code-snippet {
          background: #000000;
          border: 1px solid #003300;
          border-radius: 3px;
          padding: 0.75rem;
          margin: 0.75rem 0 0.75rem 2.75rem;
          overflow-x: auto;
        }

        .code-snippet pre {
          margin: 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .code-snippet code {
          color: #0f0;
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }

        .fix-description {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          color: #0f0;
          line-height: 1.6;
          margin: 0.75rem 0;
          padding-left: 2.75rem;
        }

        .fix-description p {
          margin: 0;
        }

        .fix-applied {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: #003300;
          margin-top: 0.75rem;
          padding-left: 2.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #003300;
        }

        .fix-label {
          color: #0f0;
          margin-right: 0.5rem;
          font-weight: bold;
        }

        .fix-value {
          color: #003300;
        }

        /* Blood drip decoration */
        .blood-drip {
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 10px;
          background: linear-gradient(to bottom, #0f0, transparent);
          opacity: 0.3;
          border-radius: 0 0 50% 50%;
        }

        .report-footer {
          text-align: center;
          margin-top: 2rem;
          padding: 1.5rem;
          background: #001100;
          border: 1px solid #0f0;
          border-radius: 4px;
          position: relative;
          z-index: 2;
          animation: fade-in 0.5s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-message {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          color: #0f0;
          margin: 0;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .exorcism-report-container {
            padding: 1rem;
          }

          .report-title {
            font-size: 1.8rem;
          }

          .report-subtitle {
            font-size: 0.85rem;
          }

          .fix-item {
            padding: 1rem;
          }

          .fix-header {
            flex-wrap: wrap;
          }

          .spooky-message {
            font-size: 1.2rem;
            flex-basis: 100%;
          }

          .fix-location,
          .fix-description,
          .fix-applied {
            padding-left: 0;
          }

          .code-snippet {
            margin-left: 0;
          }
        }

        @media (max-width: 480px) {
          .report-title {
            font-size: 1.5rem;
          }

          .report-subtitle {
            font-size: 0.75rem;
          }

          .spooky-message {
            font-size: 1rem;
          }

          .fix-number {
            font-size: 1.2rem;
          }

          .severity-icon {
            font-size: 1.2rem;
          }

          .code-snippet pre {
            font-size: 0.7rem;
          }
        }

        /* Scrollbar styling for haunted theme */
        .code-snippet::-webkit-scrollbar {
          height: 6px;
        }

        .code-snippet::-webkit-scrollbar-track {
          background: #000000;
        }

        .code-snippet::-webkit-scrollbar-thumb {
          background: #003300;
          border-radius: 3px;
        }

        .code-snippet::-webkit-scrollbar-thumb:hover {
          background: #0f0;
        }
      `}</style>
    </div>
  );
}
