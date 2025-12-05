'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import type { ResurrectionAnimationProps } from '@/src/types/ui.types';

/**
 * ResurrectionAnimation - Multi-stage animation showing code coming back to life
 * Features lightning strikes, card shaking, ectoplasm glow, and code materialization
 * with ghost moan sound effects
 */
export default function ResurrectionAnimation({
  punchCardImage,
  translatedCode,
  onComplete,
}: ResurrectionAnimationProps) {
  const [stage, setStage] = useState<'lightning' | 'shake' | 'ectoplasm' | 'materialize' | 'complete'>('lightning');
  const [visibleChars, setVisibleChars] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  // Initialize ghost moan sound effect
  useEffect(() => {
    const sound = soundRef.current;

    // Create a simple ghost moan sound using Web Audio API oscillator
    // In production, this would load an actual audio file
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playGhostMoan = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 2);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    };

    // Play ghost moan at start
    playGhostMoan();

    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, []);

  // Animation sequence controller
  useEffect(() => {
    if (isSkipped) {
      setStage('complete');
      onComplete();
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Stage 1: Lightning (0-1s)
    timers.push(setTimeout(() => setStage('shake'), 1000));

    // Stage 2: Shake (1-2s)
    timers.push(setTimeout(() => setStage('ectoplasm'), 2000));

    // Stage 3: Ectoplasm (2-3s)
    timers.push(setTimeout(() => setStage('materialize'), 3000));

    // Stage 4: Materialize (3-4s)
    timers.push(setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 4000));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isSkipped, onComplete]);

  // Code materialization effect
  useEffect(() => {
    if (stage !== 'materialize' || isSkipped) return;

    const chars = translatedCode.length;
    const duration = 1000; // 1 second
    const interval = duration / chars;

    const timer = setInterval(() => {
      setVisibleChars(prev => {
        if (prev >= chars) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [stage, translatedCode, isSkipped]);

  const handleSkip = () => {
    setIsSkipped(true);
  };

  return (
    <div className="resurrection-container">
      <AnimatePresence mode="wait">
        {/* Lightning Stage */}
        {stage === 'lightning' && (
          <motion.div
            key="lightning"
            className="stage-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="punch-card-wrapper">
              {punchCardImage && <img src={punchCardImage} alt="Punch card" className="punch-card-image" />}
              {!punchCardImage && (
                <div className="virtual-card-placeholder">
                  <div className="card-pattern">
                    {[...Array(12)].map((_, row) => (
                      <div key={row} className="card-row">
                        {[...Array(80)].map((_, col) => (
                          <div key={col} className="card-hole" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Lightning bolts */}
              <motion.svg
                className="lightning-svg"
                viewBox="0 0 200 200"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
                transition={{ duration: 1, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1] }}
              >
                <motion.path
                  d="M100 20 L80 80 L110 80 L90 140"
                  stroke="#0f0"
                  strokeWidth="3"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0, 1, 0] }}
                  transition={{ duration: 1, times: [0, 0.2, 0.4, 0.6, 1] }}
                />
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </motion.svg>

              {/* Flash effect */}
              <motion.div
                className="flash-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0, 0.6, 0, 0.4, 0] }}
                transition={{ duration: 1, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1] }}
              />
            </div>
            <p className="stage-text">⚡ Channeling ancient energies... ⚡</p>
          </motion.div>
        )}

        {/* Shake Stage */}
        {stage === 'shake' && (
          <motion.div
            key="shake"
            className="stage-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="punch-card-wrapper"
              animate={{
                x: [0, -5, 5, -5, 5, -3, 3, -3, 3, -1, 1, 0],
                y: [0, 3, -3, 3, -3, 2, -2, 2, -2, 1, -1, 0],
                rotate: [0, -2, 2, -2, 2, -1, 1, -1, 1, 0],
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {punchCardImage && <img src={punchCardImage} alt="Punch card" className="punch-card-image" />}
              {!punchCardImage && (
                <div className="virtual-card-placeholder">
                  <div className="card-pattern">
                    {[...Array(12)].map((_, row) => (
                      <div key={row} className="card-row">
                        {[...Array(80)].map((_, col) => (
                          <div key={col} className="card-hole" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            <p className="stage-text">👻 The spirits awaken... 👻</p>
          </motion.div>
        )}

        {/* Ectoplasm Stage */}
        {stage === 'ectoplasm' && (
          <motion.div
            key="ectoplasm"
            className="stage-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="punch-card-wrapper">
              {punchCardImage && <img src={punchCardImage} alt="Punch card" className="punch-card-image" />}
              {!punchCardImage && (
                <div className="virtual-card-placeholder">
                  <div className="card-pattern">
                    {[...Array(12)].map((_, row) => (
                      <div key={row} className="card-row">
                        {[...Array(80)].map((_, col) => (
                          <div key={col} className="card-hole" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ectoplasm glow effect */}
              <motion.div
                className="ectoplasm-glow"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 2, 2.5],
                  opacity: [0, 0.6, 0.4, 0.2]
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              {/* Floating particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="ectoplasm-particle"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
            <p className="stage-text">🌫️ Ectoplasm materializing... 🌫️</p>
          </motion.div>
        )}

        {/* Materialize Stage */}
        {stage === 'materialize' && (
          <motion.div
            key="materialize"
            className="stage-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="code-materialize-wrapper">
              <pre className="materializing-code">
                <code>
                  {translatedCode.substring(0, visibleChars)}
                  <motion.span
                    className="cursor"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    █
                  </motion.span>
                </code>
              </pre>
            </div>
            <p className="stage-text">💻 Code resurrecting from the void... 💻</p>
          </motion.div>
        )}

        {/* Complete Stage */}
        {stage === 'complete' && (
          <motion.div
            key="complete"
            className="stage-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="completion-message">
              <motion.h2
                className="completion-title"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ⚡ RESURRECTION COMPLETE! ⚡
              </motion.h2>
              <motion.p
                className="completion-subtitle"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                The ancient code lives again!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {stage !== 'complete' && !isSkipped && (
        <motion.button
          className="skip-button"
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip Animation →
        </motion.button>
      )}

      <style jsx>{`
        .resurrection-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        /* Scanline effect */
        .resurrection-container::before {
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
          z-index: 10;
        }

        .stage-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 2rem;
        }

        .punch-card-wrapper {
          position: relative;
          max-width: 600px;
          width: 100%;
          margin-bottom: 2rem;
        }

        .punch-card-image {
          width: 100%;
          height: auto;
          border: 2px solid #0f0;
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        }

        .virtual-card-placeholder {
          width: 100%;
          background: linear-gradient(180deg, #001a00 0%, #000800 100%);
          border: 2px solid #0f0;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        }

        .card-pattern {
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 0.7;
        }

        .card-row {
          display: flex;
          gap: 2px;
          justify-content: center;
        }

        .card-hole {
          width: 4px;
          height: 8px;
          background: #0f0;
          border-radius: 1px;
          opacity: 0.3;
          box-shadow: 0 0 2px rgba(0, 255, 0, 0.5);
        }

        .lightning-svg {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          pointer-events: none;
        }

        .flash-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0f0;
          border-radius: 8px;
          pointer-events: none;
        }

        .ectoplasm-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(0, 255, 0, 0.6) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .ectoplasm-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: #0f0;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
          pointer-events: none;
        }

        .code-materialize-wrapper {
          max-width: 800px;
          width: 100%;
          max-height: 60vh;
          overflow: auto;
          background: #000000;
          border: 2px solid #0f0;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        }

        .materializing-code {
          margin: 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #0f0;
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .materializing-code code {
          font-family: inherit;
        }

        .cursor {
          color: #0f0;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
        }

        .stage-text {
          font-family: 'Creepster', cursive;
          font-size: 1.8rem;
          color: #0f0;
          text-align: center;
          margin: 2rem 0 0 0;
          text-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
          letter-spacing: 2px;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
          }
          50% {
            text-shadow: 0 0 25px rgba(0, 255, 0, 1);
          }
        }

        .completion-message {
          text-align: center;
        }

        .completion-title {
          font-family: 'Creepster', cursive;
          font-size: 3rem;
          color: #0f0;
          margin: 0 0 1rem 0;
          text-shadow: 0 0 20px rgba(0, 255, 0, 1);
          letter-spacing: 3px;
        }

        .completion-subtitle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.5rem;
          color: #0f0;
          margin: 0;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
        }

        .skip-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 0.75rem 1.5rem;
          background: #001100;
          border: 2px solid #0f0;
          border-radius: 4px;
          color: #0f0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
          z-index: 11;
          /* Ensure minimum touch target size */
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
        }

        .skip-button:hover {
          background: #003300;
          box-shadow: 0 0 25px rgba(0, 255, 0, 0.6);
        }

        .skip-button:active {
          transform: scale(0.95);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .stage-container {
            padding: 1rem;
          }

          .punch-card-wrapper {
            max-width: 100%;
          }

          .stage-text {
            font-size: 1.3rem;
          }

          .completion-title {
            font-size: 2rem;
          }

          .completion-subtitle {
            font-size: 1.1rem;
          }

          .code-materialize-wrapper {
            padding: 1rem;
            max-height: 50vh;
          }

          .materializing-code {
            font-size: 0.75rem;
          }

          .skip-button {
            bottom: 1rem;
            right: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .stage-text {
            font-size: 1rem;
          }

          .completion-title {
            font-size: 1.5rem;
          }

          .completion-subtitle {
            font-size: 0.9rem;
          }

          .materializing-code {
            font-size: 0.65rem;
          }
        }

        /* Scrollbar styling */
        .code-materialize-wrapper::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-materialize-wrapper::-webkit-scrollbar-track {
          background: #000000;
        }

        .code-materialize-wrapper::-webkit-scrollbar-thumb {
          background: #003300;
          border-radius: 4px;
        }

        .code-materialize-wrapper::-webkit-scrollbar-thumb:hover {
          background: #0f0;
        }
      `}</style>
    </div>
  );
}
