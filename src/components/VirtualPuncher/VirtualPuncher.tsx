'use client';

import { useState, useCallback, useEffect } from 'react';
import type { VirtualPuncherProps } from '@/src/types/ui.types';
import { submitVirtualCard } from '@/src/utils/api-client';

/**
 * VirtualPuncher - Interactive 80×12 punch card editor
 * Allows users to create virtual punch cards by clicking to toggle holes
 */
export default function VirtualPuncher({ onSubmit, initialPattern }: VirtualPuncherProps) {
  // Initialize 12 rows × 80 columns grid (all unpunched by default)
  const [grid, setGrid] = useState<boolean[][]>(() => {
    if (initialPattern && initialPattern.length === 12 && initialPattern[0]?.length === 80) {
      return initialPattern;
    }
    return Array.from({ length: 12 }, () => Array(80).fill(false));
  });

  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Toggle a punch hole at the specified position
   */
  const toggleHole = useCallback((row: number, col: number) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  }, []);

  /**
   * Clear all punch holes
   */
  const clearGrid = useCallback(() => {
    setGrid(Array.from({ length: 12 }, () => Array(80).fill(false)));
    setEasterEggTriggered(false);
  }, []);

  /**
   * Submit the punch pattern for processing
   */
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(grid);
    } finally {
      setIsSubmitting(false);
    }
  }, [grid, onSubmit]);

  /**
   * Detect "666" pattern easter egg
   * Checks for the pattern in any column sequence
   * In IBM 029 encoding, "6" is represented by punching row 6
   */
  useEffect(() => {
    // Check for "666" pattern in punch card encoding
    // In IBM 029, "6" is typically punched as 6-row position
    // We'll check for three consecutive columns with row 6 punched
    for (let col = 0; col < 78; col++) {
      // Check if columns col, col+1, col+2 all have row 6 punched
      // and form a recognizable "666" pattern
      if (
        grid[6]?.[col] && 
        grid[6]?.[col + 1] && 
        grid[6]?.[col + 2]
      ) {
        // Additional check: ensure it's a distinct pattern (not just noise)
        const col1Punches = grid.filter(row => row[col]).length;
        const col2Punches = grid.filter(row => row[col + 1]).length;
        const col3Punches = grid.filter(row => row[col + 2]).length;
        
        // If each column has 1-3 punches (typical for a character), trigger easter egg
        if (
          col1Punches >= 1 && col1Punches <= 3 &&
          col2Punches >= 1 && col2Punches <= 3 &&
          col3Punches >= 1 && col3Punches <= 3
        ) {
          if (!easterEggTriggered) {
            triggerEasterEgg();
          }
          return;
        }
      }
    }
  }, [grid, easterEggTriggered]);

  /**
   * Trigger the 666 easter egg effect
   * - Red screen flash
   * - Exorcism chant audio
   * - Visual indicator
   */
  const triggerEasterEgg = useCallback(() => {
    setEasterEggTriggered(true);
    
    // Red screen flash effect
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#ff0000';
    document.body.style.transition = 'background-color 0.1s';
    
    setTimeout(() => {
      document.body.style.backgroundColor = originalBg;
    }, 500);

    // Play exorcism chant audio using Web Audio API
    // Create a spooky low-frequency tone
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for the chant effect
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Low frequency for spooky effect
      oscillator.frequency.value = 110; // Low A note
      oscillator.type = 'sawtooth'; // Harsh, demonic sound
      
      // Fade in and out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);
      
      // Add a second oscillator for harmony
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.value = 165; // E note (tritone - "devil's interval")
      oscillator2.type = 'sawtooth';
      
      gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
      gainNode2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
      
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 1.5);
      
      console.log('🔥 EASTER EGG TRIGGERED: 666 DETECTED! 🔥');
    } catch (error) {
      // Fallback if Web Audio API is not available
      console.log('🔥 EASTER EGG TRIGGERED: 666 DETECTED! 🔥 (Audio unavailable)');
    }
  }, []);

  return (
    <div className="virtual-puncher-container">
      {/* Header */}
      <div className="puncher-header">
        <h2 className="puncher-title">Virtual Punch Card Editor</h2>
        <p className="puncher-subtitle">
          Click to punch holes • 80 columns × 12 rows
        </p>
      </div>

      {/* Grid Container */}
      <div className="puncher-grid-wrapper">
        <div 
          className="puncher-grid"
          role="grid"
          aria-label="Virtual punch card grid"
        >
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="puncher-row" role="row">
              {row.map((isPunched, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`puncher-cell ${isPunched ? 'punched' : 'unpunched'}`}
                  onClick={() => toggleHole(rowIndex, colIndex)}
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                  role="gridcell"
                  aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}, ${isPunched ? 'punched' : 'unpunched'}`}
                  aria-pressed={isPunched}
                  type="button"
                >
                  <div className="hole" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="puncher-controls">
        <button
          onClick={clearGrid}
          className="btn-secondary"
          disabled={isSubmitting}
          type="button"
        >
          Clear Card
        </button>
        <button
          onClick={handleSubmit}
          className="btn-primary"
          disabled={isSubmitting}
          type="button"
        >
          {isSubmitting ? 'Resurrecting...' : 'Resurrect Code'}
        </button>
      </div>

      {/* Easter Egg Indicator */}
      {easterEggTriggered && (
        <div className="easter-egg-message" role="alert">
          🔥 THE BEAST HAS BEEN SUMMONED 🔥
        </div>
      )}

      <style jsx>{`
        .virtual-puncher-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          background: #000000;
          border: 2px solid #0f0;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }

        .puncher-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .puncher-title {
          font-family: 'Creepster', cursive;
          font-size: 2.5rem;
          color: #0f0;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
        }

        .puncher-subtitle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          color: #003300;
          margin: 0;
        }

        .puncher-grid-wrapper {
          overflow-x: auto;
          overflow-y: hidden;
          margin-bottom: 2rem;
          background: #001100;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #003300;
        }

        .puncher-grid {
          display: inline-block;
          min-width: min-content;
        }

        .puncher-row {
          display: flex;
          gap: 2px;
        }

        .puncher-cell {
          width: 12px;
          height: 12px;
          padding: 0;
          margin: 0;
          border: 1px solid #003300;
          background: #000000;
          cursor: pointer;
          transition: all 0.1s ease;
          position: relative;
          border-radius: 2px;
          /* Ensure touch-friendly on mobile with larger tap area */
          touch-action: manipulation;
        }

        .puncher-cell:hover {
          border-color: #0f0;
          box-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
        }

        .puncher-cell:focus {
          outline: 2px solid #0f0;
          outline-offset: 1px;
        }

        .puncher-cell:active {
          transform: scale(0.95);
        }

        .puncher-cell.punched {
          background: #0f0;
          box-shadow: 0 0 6px rgba(0, 255, 0, 0.8);
        }

        .puncher-cell.punched .hole {
          width: 8px;
          height: 8px;
          background: #00ff00;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 4px rgba(0, 255, 0, 1);
        }

        .puncher-cell.unpunched .hole {
          width: 6px;
          height: 6px;
          background: transparent;
          border: 1px solid #003300;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .puncher-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }

        .btn-primary,
        .btn-secondary {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          padding: 0.75rem 2rem;
          border: 2px solid #0f0;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          min-width: 180px;
        }

        .btn-primary {
          background: #0f0;
          color: #000000;
          font-weight: bold;
        }

        .btn-primary:hover:not(:disabled) {
          background: #00ff00;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #000000;
          color: #0f0;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #003300;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.4);
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .easter-egg-message {
          margin-top: 1rem;
          padding: 1rem;
          background: #330000;
          border: 2px solid #ff0000;
          border-radius: 4px;
          text-align: center;
          font-family: 'Creepster', cursive;
          font-size: 1.5rem;
          color: #ff0000;
          text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Responsive design - Mobile ≤768px */
        @media (max-width: 768px) {
          .virtual-puncher-container {
            padding: 1rem;
          }

          .puncher-title {
            font-size: 1.8rem;
          }

          .puncher-subtitle {
            font-size: 0.8rem;
          }

          .puncher-cell {
            width: 10px;
            height: 10px;
            /* Increase tap target size for mobile - minimum 44x44px */
            min-width: 44px;
            min-height: 44px;
            /* Use padding to maintain visual size while increasing tap area */
            padding: 17px;
          }

          .puncher-grid-wrapper {
            padding: 0.5rem;
          }

          .puncher-controls {
            flex-direction: column;
            gap: 0.75rem;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            min-width: unset;
            /* Ensure minimum touch target size */
            min-height: 44px;
            padding: 0.75rem 1.5rem;
          }
        }

        /* Tablet 769-1024px */
        @media (min-width: 769px) and (max-width: 1024px) {
          .puncher-cell {
            width: 11px;
            height: 11px;
          }

          .puncher-title {
            font-size: 2.2rem;
          }
        }

        /* Small mobile ≤480px */
        @media (max-width: 480px) {
          .puncher-cell {
            width: 8px;
            height: 8px;
            /* Maintain minimum touch target */
            min-width: 44px;
            min-height: 44px;
            padding: 18px;
          }

          .puncher-title {
            font-size: 1.5rem;
          }

          .puncher-subtitle {
            font-size: 0.7rem;
          }

          .btn-primary,
          .btn-secondary {
            font-size: 0.9rem;
            padding: 0.65rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
