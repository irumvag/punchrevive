'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lineBasedEncodingService, LINE_BASED_DEMOS, type LineBasedDeck } from '@/src/services/line-based-encoding.service';

interface LineBasedPuncherProps {
  onSubmit: (deck: LineBasedDeck) => void;
}

export default function LineBasedPuncher({ onSubmit }: LineBasedPuncherProps) {
  const [sourceCode, setSourceCode] = useState('');
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [deck, setDeck] = useState<LineBasedDeck | null>(null);

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

  const stats = deck ? lineBasedEncodingService.getDeckStats(deck) : null;

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

            {/* Card Preview */}
            <div className="bg-black/60 border-2 border-dark-green rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-creepster text-toxic-green mb-4 text-center sticky top-0 bg-black/90 py-2">
                Encoded Cards Preview
              </h3>
              <div className="space-y-3">
                {deck.cards.map((card, index) => (
                  <motion.div
                    key={card.column}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-black/40 border border-dark-green rounded p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-toxic-green font-bold">
                        Line {card.column}
                      </span>
                      <span className="text-xs font-mono text-dark-green">
                        {card.bits.length} bits
                      </span>
                    </div>
                    <div className="text-xs font-mono text-toxic-green mb-2 break-all opacity-70">
                      {card.preview}
                    </div>
                    <div className="text-xs font-mono text-dark-green break-all overflow-hidden" style={{ maxHeight: '3em' }}>
                      {card.bits.slice(0, 160)}...
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

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
