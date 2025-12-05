'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { VirtualPuncherProps } from '@/src/types/ui.types';
import { DEMO_PATTERNS, patternToGrid } from '@/src/utils/demo-patterns';
import toast from 'react-hot-toast';

interface SavedCard {
  id: string;
  name: string;
  grid_data: boolean[][];
  rows: number;
  cols: number;
  original_text: string | null;
}

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
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loadingSavedCards, setLoadingSavedCards] = useState(false);
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [loadedCardName, setLoadedCardName] = useState<string | null>(null);

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

  const loadSavedCards = useCallback(async () => {
    setLoadingSavedCards(true);
    try {
      const response = await fetch('/api/cards?type=virtual');
      if (!response.ok) throw new Error('Failed to load cards');
      const result = await response.json();
      setSavedCards(result.cards || []);
    } catch (error) {
      console.error('Error loading saved cards:', error);
      toast.error('Failed to load saved cards');
    } finally {
      setLoadingSavedCards(false);
    }
  }, []);

  const loadSavedCard = useCallback((cardId: string) => {
    const card = savedCards.find(c => c.id === cardId);
    if (!card) return;

    const newGrid: boolean[][] = Array.from({ length: 12 }, () => Array(80).fill(false));

    for (let row = 0; row < card.rows && row < 12; row++) {
      for (let col = 0; col < card.cols && col < 80; col++) {
        newGrid[row][col] = card.grid_data[row]?.[col] || false;
      }
    }

    setGrid(newGrid);
    setLoadedCardName(card.name);
    setDecodedText(null);
    toast.success(`Loaded: ${card.name}`);
  }, [savedCards]);

  const decodeCard = useCallback(() => {
    const bits: string[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 80; col++) {
        bits.push(grid[row]?.[col] ? '1' : '0');
      }
    }

    const bitString = bits.join('');
    const chars: string[] = [];

    for (let i = 0; i < bitString.length; i += 8) {
      const byte = bitString.slice(i, i + 8);
      const charCode = parseInt(byte, 2);
      if (charCode > 0) {
        chars.push(String.fromCharCode(charCode));
      }
    }

    const decoded = chars.join('').replace(/\0+$/, '');
    setDecodedText(decoded);
    toast.success('Card decoded!');
  }, [grid]);

  const saveCard = useCallback(async () => {
    const cardName = prompt('Enter a name for this punch card:');
    if (!cardName || !cardName.trim()) {
      toast.error('Card name is required');
      return;
    }

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cardName.trim(),
          grid_data: grid,
          rows: 12,
          cols: 80,
          original_text: decodedText,
          card_type: 'virtual',
        }),
      });

      if (!response.ok) throw new Error('Failed to save card');

      const result = await response.json();
      toast.success(`Card saved: ${cardName}`);

      await loadSavedCards();
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    }
  }, [grid, decodedText, loadSavedCards]);

  useEffect(() => {
    loadSavedCards();
  }, [loadSavedCards]);

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

      {/* Saved Cards Selector */}
      {savedCards.length > 0 && (
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', color: '#0f0', marginRight: '0.5rem' }}>
            💾 Load Saved Card:
          </label>
          <select
            onChange={(e) => e.target.value && loadSavedCard(e.target.value)}
            disabled={isSubmitting || loadingSavedCards}
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
            defaultValue=""
          >
            <option value="">-- Select a saved card --</option>
            {savedCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name}
              </option>
            ))}
          </select>
          {loadedCardName && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#0f0',
              fontFamily: 'IBM Plex Mono, monospace'
            }}>
              Currently loaded: {loadedCardName}
            </div>
          )}
        </div>
      )}

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
        {loadedCardName && (
          <motion.button
            onClick={decodeCard}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.9rem',
              padding: '0.875rem 1.5rem',
              border: '2px solid #0f0',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              background: '#001100',
              color: '#0f0',
              minHeight: '48px',
            }}
          >
            🔍 Decode Text
          </motion.button>
        )}
        <motion.button
          onClick={saveCard}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.9rem',
            padding: '0.875rem 1.5rem',
            border: '2px solid #00ff88',
            borderRadius: '6px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            background: 'transparent',
            color: '#00ff88',
            minHeight: '48px',
          }}
        >
          💾 Save Card
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

      {decodedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#001100',
            border: '2px solid #0f0',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0,255,0,0.3)',
          }}
        >
          <h3 style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '1rem',
            color: '#0f0',
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}>
            📜 Decoded Text
          </h3>
          <pre style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.9rem',
            color: '#0f0',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            margin: 0,
            textShadow: '0 0 5px #0f0',
          }}>
            {decodedText}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
