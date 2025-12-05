'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lineBasedEncodingService, LINE_BASED_DEMOS, type LineBasedDeck } from '@/src/services/line-based-encoding.service';
import toast from 'react-hot-toast';

interface LineBasedPuncherProps {
  onSubmit: (deck: LineBasedDeck) => void;
}

interface SavedCard {
  id: string;
  name: string;
  grid_data: boolean[][];
  rows: number;
  cols: number;
  original_text: string | null;
  card_type: 'line-based' | 'virtual';
}

export default function LineBasedPuncher({ onSubmit }: LineBasedPuncherProps) {
  const [sourceCode, setSourceCode] = useState('');
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [deck, setDeck] = useState<LineBasedDeck | null>(null);
  const [savingCardIndex, setSavingCardIndex] = useState<number | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loadingSavedCards, setLoadingSavedCards] = useState(false);
  const [loadedCardText, setLoadedCardText] = useState<string | null>(null);
  const [showLoadedCard, setShowLoadedCard] = useState(false);

  const handleLoadDemo = (demoKey: keyof typeof LINE_BASED_DEMOS) => {
    const demoCode = LINE_BASED_DEMOS[demoKey];
    setSourceCode(demoCode);
    setSelectedDemo(demoKey);
    setShowPreview(false);
    setDeck(null);
  };

  const handleEncode = () => {
    if (!sourceCode.trim()) {
      return;
    }

    const language = lineBasedEncodingService.detectLanguage(sourceCode);
    const encodedDeck = lineBasedEncodingService.encodeSource(sourceCode, {
      language,
      filename: selectedDemo || 'user-input.txt'
    });

    setDeck(encodedDeck);
    setShowPreview(true);
  };

  const handleResurrect = () => {
    if (!deck) return;
    onSubmit(deck);
  };

  const handleSaveCard = async (cardIndex: number) => {
    if (!deck) return;

    const card = deck.cards[cardIndex];
    setSavingCardIndex(cardIndex);

    try {
      const grid: boolean[][] = [];
      for (let row = 0; row < 8; row++) {
        grid[row] = [];
        for (let col = 0; col < 80; col++) {
          const bitIndex = row * 80 + col;
          grid[row][col] = card.bits[bitIndex] === '1';
        }
      }

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Line ${card.column}: ${(card.preview || '').slice(0, 30)}`,
          grid_data: grid,
          rows: 8,
          cols: 80,
          original_text: card.preview || '',
          card_type: 'line-based',
        }),
      });

      if (!response.ok) throw new Error('Failed to save card');

      const result = await response.json();
      toast.success(`Card #${card.column} saved!`);
      return result.card.id;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    } finally {
      setSavingCardIndex(null);
    }
  };

  const loadSavedCards = useCallback(async () => {
    setLoadingSavedCards(true);
    try {
      const response = await fetch('/api/cards');
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

  useEffect(() => {
    loadSavedCards();
  }, [loadSavedCards]);

  const loadSavedCard = useCallback((cardId: string) => {
    const card = savedCards.find(c => c.id === cardId);
    if (!card) return;

    const grid: boolean[][] = Array.from({ length: 8 }, () => Array(80).fill(false));

    for (let row = 0; row < card.rows && row < 8; row++) {
      for (let col = 0; col < card.cols && col < 80; col++) {
        grid[row][col] = card.grid_data[row]?.[col] || false;
      }
    }

    const bits: string[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 80; col++) {
        bits.push(grid[row][col] ? '1' : '0');
      }
    }

    const singleCardDeck: LineBasedDeck = {
      cards: [{
        column: 1,
        bits: bits.join(''),
        preview: card.original_text || ''
      }],
      metadata: {
        filename: card.name,
        language: 'unknown'
      }
    };

    setDeck(singleCardDeck);
    setLoadedCardText(card.original_text);
    setShowPreview(true);
    setShowLoadedCard(true);
    toast.success(`Loaded: ${card.name}`);
  }, [savedCards]);

  const stats = deck ? lineBasedEncodingService.getDeckStats(deck) : null;
  const lineBasedCards = savedCards.filter(c => c.card_type === 'line-based');

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl sm:text-3xl font-creepster text-toxic-green mb-2">
          Line-Based Encoding
        </h2>
        <p className="text-sm sm:text-base font-mono text-dark-green">
          Each line = 640 bits of pure code resurrection power
        </p>
      </motion.div>

      {/* Demo Buttons */}
      <div className="mb-6">
        <p className="text-sm font-mono text-toxic-green mb-3 text-center">
          Load Demo Code:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.keys(LINE_BASED_DEMOS).map((key) => (
            <motion.button
              key={key}
              onClick={() => handleLoadDemo(key as keyof typeof LINE_BASED_DEMOS)}
              className={`
                px-3 py-2 text-xs font-mono border-2 rounded transition-all
                ${selectedDemo === key
                  ? 'bg-toxic-green text-black border-toxic-green'
                  : 'bg-black/40 text-toxic-green border-dark-green hover:border-toxic-green'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {key.replace(/_/g, ' ')}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Load Saved Cards */}
      {lineBasedCards.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-mono text-toxic-green mb-3 text-center">
            Load Saved Card:
          </p>
          <div className="flex justify-center">
            <select
              onChange={(e) => loadSavedCard(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-black/60 border-2 border-dark-green text-toxic-green font-mono text-sm rounded focus:outline-none focus:border-toxic-green transition-colors"
              disabled={loadingSavedCards}
              defaultValue=""
            >
              <option value="" disabled>
                {loadingSavedCards ? 'Loading cards...' : 'Select a saved card...'}
              </option>
              {lineBasedCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Code Input */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <textarea
            value={sourceCode}
            onChange={(e) => {
              setSourceCode(e.target.value);
              setShowPreview(false);
              setDeck(null);
            }}
            placeholder="Enter your source code here...&#10;Each line will be encoded as a 640-bit sequence.&#10;Max 80 characters per line (auto-truncated)."
            className="w-full h-48 sm:h-64 p-4 bg-black/60 border-2 border-dark-green text-toxic-green font-mono text-sm rounded resize-none focus:outline-none focus:border-toxic-green transition-colors"
            style={{ textShadow: '0 0 5px rgba(0, 255, 0, 0.5)' }}
          />
          <div className="absolute bottom-3 right-3 text-xs font-mono text-dark-green">
            {sourceCode.split('\n').length} lines
          </div>
        </div>
      </motion.div>

      {/* Encode Button */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={handleEncode}
          disabled={!sourceCode.trim()}
          className="px-8 py-4 bg-toxic-green text-black font-mono font-bold text-lg border-2 border-toxic-green rounded uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)' }}
          whileHover={sourceCode.trim() ? { scale: 1.05, y: -2 } : {}}
          whileTap={sourceCode.trim() ? { scale: 0.95 } : {}}
        >
          Encode to Punch Cards
        </motion.button>
      </motion.div>

      {/* Preview & Stats */}
      <AnimatePresence>
        {showPreview && deck && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Stats Panel */}
            <div className="bg-black/60 border-2 border-toxic-green rounded-lg p-6">
              <h3 className="text-xl font-creepster text-toxic-green mb-4 text-center">
                Punch Card Deck Statistics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-toxic-green">{stats.totalCards}</div>
                  <div className="text-xs font-mono text-dark-green">Cards</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-toxic-green">{stats.totalBits.toLocaleString()}</div>
                  <div className="text-xs font-mono text-dark-green">Bits</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-toxic-green">{stats.totalBytes}</div>
                  <div className="text-xs font-mono text-dark-green">Bytes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-toxic-green">{stats.totalCharacters}</div>
                  <div className="text-xs font-mono text-dark-green">Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-toxic-green">{stats.averageLineLength}</div>
                  <div className="text-xs font-mono text-dark-green">Avg Line</div>
                </div>
              </div>
              {deck.metadata?.language && (
                <div className="mt-4 text-center">
                  <span className="inline-block px-4 py-2 bg-toxic-green/20 border border-toxic-green rounded text-toxic-green font-mono text-sm">
                    Detected: {deck.metadata.language}
                  </span>
                </div>
              )}
            </div>

            {/* Card Preview - Visual Punch Cards */}
            <div className="bg-black/60 border-2 border-dark-green rounded-lg p-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-creepster text-toxic-green mb-4 text-center sticky top-0 bg-black/90 py-2 z-10">
                Virtual Punch Cards
              </h3>
              <div className="space-y-6">
                {deck.cards.map((card, index) => {
                  // Convert 640 bits to 8 rows × 80 columns grid
                  const grid: boolean[][] = [];
                  for (let row = 0; row < 8; row++) {
                    grid[row] = [];
                    for (let col = 0; col < 80; col++) {
                      const bitIndex = row * 80 + col;
                      grid[row][col] = card.bits[bitIndex] === '1';
                    }
                  }

                  return (
                    <motion.div
                      key={card.column}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-b from-black/80 to-black border-2 border-toxic-green rounded-lg p-4"
                      style={{ boxShadow: '0 0 20px rgba(0,255,0,0.2), inset 0 0 30px rgba(0,255,0,0.05)' }}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-dark-green">
                        <span className="text-sm font-mono text-toxic-green font-bold">
                          Card #{card.column}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-dark-green">
                            8 rows × 80 columns
                          </span>
                          <motion.button
                            onClick={() => handleSaveCard(index)}
                            disabled={savingCardIndex === index}
                            className="px-2 py-1 text-xs font-mono border border-toxic-green/50 rounded bg-black/40 text-toxic-green/70 hover:text-toxic-green hover:border-toxic-green transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {savingCardIndex === index ? '💾...' : '💾 Save'}
                          </motion.button>
                        </div>
                      </div>

                      {/* Line Preview */}
                      <div className="text-xs font-mono text-toxic-green/70 mb-3 truncate">
                        {card.preview}
                      </div>

                      {/* Visual Punch Card Grid */}
                      <div className="overflow-x-auto pb-2">
                        <div className="inline-block min-w-max">
                          {grid.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-[2px] mb-[2px]">
                              {row.map((isPunched, colIndex) => (
                                <div
                                  key={`${rowIndex}-${colIndex}`}
                                  className={`w-[10px] h-[10px] border rounded-sm transition-all ${
                                    isPunched
                                      ? 'bg-toxic-green border-toxic-green shadow-[0_0_6px_rgba(0,255,0,0.8)]'
                                      : 'bg-black border-dark-green'
                                  }`}
                                  style={{
                                    boxShadow: isPunched ? '0 0 6px #0f0' : 'none'
                                  }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Punch Count */}
                      <div className="text-xs font-mono text-dark-green text-right mt-2 pt-2 border-t border-dark-green/30">
                        {grid.flat().filter(Boolean).length} holes punched
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Decoded Text Display for Loaded Cards */}
            {showLoadedCard && loadedCardText && (
              <div className="bg-black/60 border-2 border-toxic-green rounded-lg p-6">
                <h3 className="text-xl font-creepster text-toxic-green mb-4 text-center">
                  Decoded Text
                </h3>
                <div className="bg-black/80 border border-dark-green rounded p-4">
                  <pre className="text-toxic-green font-mono text-sm whitespace-pre-wrap break-words">
                    {loadedCardText}
                  </pre>
                </div>
              </div>
            )}

            {/* Resurrect Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handleResurrect}
                className="px-12 py-5 bg-black border-4 border-toxic-green text-toxic-green font-creepster text-2xl rounded-lg uppercase tracking-wider"
                style={{ boxShadow: '0 0 40px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.1)' }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.1)',
                    '0 0 60px rgba(0, 255, 0, 0.8), inset 0 0 30px rgba(0, 255, 0, 0.2)',
                    '0 0 40px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.1)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡ Resurrect Code ⚡
              </motion.button>
              <p className="mt-4 text-sm font-mono text-dark-green">
                Ready to bring {stats.totalCards} lines back from the dead
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
