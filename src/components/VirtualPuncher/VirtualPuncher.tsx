'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { VirtualPuncherProps } from '@/src/types/ui.types';
import { DEMO_PATTERNS, patternToGrid } from '@/src/utils/demo-patterns';

export default function VirtualPuncher({ onSubmit, initialPattern }: VirtualPuncherProps) {
  const [selectedDemo, setSelectedDemo] = useState(0);
  const [grid, setGrid] = useState<boolean[][]>(() => {
    if (initialPattern && initialPattern.length === 12 && initialPattern[0]?.length === 80) {
      return initialPattern;
    }
    return patternToGrid(DEMO_PATTERNS[0]);
  });

  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const playPunchSound = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch { /* Audio unavailable */ }
  }, []);

  const toggleHole = useCallback((row: number, col: number) => {
    playPunchSound();
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  }, [playPunchSound]);

  const clearGrid = useCallback(() => {
    setGrid(Array.from({ length: 12 }, () => Array(80).fill(false)));
    setEasterEggTriggered(false);
  }, []);

  const loadDemo = useCallback((demoIndex?: number) => {
    const index = demoIndex !== undefined ? demoIndex : selectedDemo;
    setSelectedDemo(index);
    setGrid(patternToGrid(DEMO_PATTERNS[index]));
    setEasterEggTriggered(false);
  }, [selectedDemo]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try { await onSubmit(grid); } finally { setIsSubmitting(false); }
  }, [grid, onSubmit]);

  useEffect(() => {
    for (let col = 0; col < 78; col++) {
      if (grid[6]?.[col] && grid[6]?.[col + 1] && grid[6]?.[col + 2] && !easterEggTriggered) {
        setEasterEggTriggered(true);
        document.body.style.backgroundColor = '#ff0000';
        setTimeout(() => { document.body.style.backgroundColor = ''; }, 500);
        return;
      }
    }
  }, [grid, easterEggTriggered]);

  const punchCount = grid.flat().filter(Boolean).length;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
      border: '3px solid #0f0',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 0 40px rgba(0,255,0,0.3), inset 0 0 60px rgba(0,255,0,0.05)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: 'Creepster, cursive',
          fontSize: '2rem',
          color: '#0f0',
          margin: '0 0 0.5rem',
          textShadow: '0 0 15px #0f0',
        }}>
          ⌨️ Virtual Punch Card ⌨️
        </h2>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', color: '#003300', margin: '0 0 1rem' }}>
          Click cells to punch • 80 columns × 12 rows
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#001100',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid #003300',
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: '#003300' }}>Holes:</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2rem', fontWeight: 'bold', color: '#0f0', textShadow: '0 0 10px #0f0' }}>{punchCount}</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        background: '#050505',
        border: '2px solid #003300',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}>
        <div style={{ display: 'inline-block', minWidth: 'max-content' }}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
              {row.map((isPunched, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => toggleHole(rowIndex, colIndex)}
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                  className={isPunched ? 'punched' : ''}
                  style={{
                    width: '10px',
                    height: '10px',
                    padding: 0,
                    border: '1px solid #003300',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    background: isPunched ? '#0f0' : '#000',
                    boxShadow: isPunched ? '0 0 6px #0f0' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0f0';
                    e.currentTarget.style.transform = 'scale(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#003300';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Demo Selector */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', color: '#0f0', marginRight: '0.5rem' }}>
          Select Demo:
        </label>
        <select
          value={selectedDemo}
          onChange={(e) => loadDemo(Number(e.target.value))}
          disabled={isSubmitting}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.9rem',
            padding: '0.5rem 1rem',
            border: '2px solid #0f0',
            borderRadius: '6px',
            background: '#000',
            color: '#0f0',
            cursor: 'pointer',
          }}
        >
          {DEMO_PATTERNS.map((demo, index) => (
            <option key={index} value={index}>
              {demo.name} - {demo.description}
            </option>
          ))}
        </select>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <motion.button
          onClick={clearGrid}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.9rem',
            padding: '0.875rem 1.5rem',
            border: '2px solid #330000',
            borderRadius: '6px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            background: 'transparent',
            color: '#ff4444',
            minHeight: '48px',
          }}
        >
          💀 Clear
        </motion.button>
        <motion.button
          onClick={() => loadDemo()}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.9rem',
            padding: '0.875rem 1.5rem',
            border: '2px solid #003300',
            borderRadius: '6px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            background: 'transparent',
            color: '#0f0',
            minHeight: '48px',
          }}
        >
          🧛 Reload Demo
        </motion.button>
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px #0f0' }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.9rem',
            padding: '0.875rem 1.5rem',
            border: '2px solid #0f0',
            borderRadius: '6px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            background: '#0f0',
            color: '#000',
            fontWeight: 'bold',
            minHeight: '48px',
            boxShadow: '0 0 20px rgba(0,255,0,0.5)',
          }}
        >
          {isSubmitting ? '🔮 Resurrecting...' : '⚡ RESURRECT CODE ⚡'}
        </motion.button>
      </div>

      {easterEggTriggered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'linear-gradient(180deg, #330000 0%, #1a0000 100%)',
            border: '2px solid #ff0000',
            borderRadius: '6px',
            textAlign: 'center',
            fontFamily: 'Creepster, cursive',
            fontSize: '1.4rem',
            color: '#ff0000',
            textShadow: '0 0 15px rgba(255,0,0,0.8)',
          }}
        >
          🔥 THE BEAST HAS BEEN SUMMONED 🔥
        </motion.div>
      )}
    </div>
  );
}
