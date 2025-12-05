'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import HauntedLayout from '@/src/components/HauntedLayout';
import UploadZone from '@/src/components/UploadZone';
import VirtualPuncher from '@/src/components/VirtualPuncher';
import LineBasedPuncher from '@/src/components/LineBasedPuncher';
import { uploadPunchCardImage, submitVirtualCard } from '@/src/utils/api-client';
import type { LineBasedDeck } from '@/src/services/line-based-encoding.service';

type Mode = 'upload' | 'virtual' | 'line-based';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('virtual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const response = await uploadPunchCardImage(file, 'upload');
      if (response.success && response.jobId) {
        setShowSuccessModal(true);
        setTimeout(() => router.push(`/results/${response.jobId}`), 1500);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed - please try again');
      setIsProcessing(false);
    }
  };

  const handleVirtualSubmit = async (pattern: boolean[][]) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/resurrect-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern }),
      });

      const data = await response.json();

      if (data.success && data.jobId) {
        setShowSuccessModal(true);
        setTimeout(() => router.push(`/results/${data.jobId}`), 1500);
      } else {
        throw new Error(data.message || 'Resurrection failed');
      }
    } catch (error) {
      console.error('Resurrection error:', error);
      toast.error(error instanceof Error ? error.message : 'Resurrection failed - please try again');
      setIsProcessing(false);
    }
  };

  const handleLineBasedSubmit = async (deck: LineBasedDeck) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/resurrect-line-based', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deck }),
      });

      const data = await response.json();

      if (data.success && data.jobId) {
        setShowSuccessModal(true);
        setTimeout(() => router.push(`/results/${data.jobId}`), 1500);
      } else {
        throw new Error(data.message || 'Line-based resurrection failed');
      }
    } catch (error) {
      console.error('Line-based resurrection error:', error);
      toast.error(error instanceof Error ? error.message : 'Line-based resurrection failed - please try again');
      setIsProcessing(false);
    }
  };

  const skipIntro = () => setShowIntro(false);

  if (!mounted) return null;

  return (
    <HauntedLayout glowIntensity="high">
      {/* Intro Animation - Simplified */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer"
            onClick={skipIntro}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1
                className="text-6xl sm:text-8xl md:text-9xl font-creepster text-toxic-green"
                style={{ textShadow: '0 0 40px #0f0, 0 0 80px #0f0' }}
              >
                PunchRevive
              </h1>
              <p className="text-lg sm:text-xl font-mono text-dark-green mt-4">
                Click to enter...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          className="w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header - Simplified */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-creepster text-toxic-green mb-4">
              PunchRevive
            </h1>
            <p className="text-lg sm:text-xl font-mono text-toxic-green mb-2">
              Resurrect Dead Code
            </p>
            <p className="text-sm sm:text-base font-mono text-dark-green opacity-70">
              Decode vintage IBM punch cards
            </p>
          </div>

          {/* Mode Selection - Card Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <motion.button
              onClick={() => setMode('upload')}
              disabled={isProcessing}
              className={`
                relative p-6 sm:p-8 rounded-lg border-2 transition-all duration-300
                ${mode === 'upload'
                  ? 'bg-toxic-green/10 border-toxic-green'
                  : 'bg-black/40 border-dark-green hover:border-toxic-green hover:bg-toxic-green/5'
                }
              `}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">📸</div>
                <h3 className="text-xl font-mono font-bold text-toxic-green mb-2">
                  Upload Photo
                </h3>
                <p className="text-sm font-mono text-dark-green">
                  Scan a punch card image
                </p>
              </div>
              {mode === 'upload' && (
                <div
                  className="absolute inset-0 rounded-lg border-2 border-toxic-green pointer-events-none"
                  style={{ boxShadow: '0 0 30px rgba(0,255,0,0.5)' }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => setMode('virtual')}
              disabled={isProcessing}
              className={`
                relative p-6 sm:p-8 rounded-lg border-2 transition-all duration-300
                ${mode === 'virtual'
                  ? 'bg-toxic-green/10 border-toxic-green'
                  : 'bg-black/40 border-dark-green hover:border-toxic-green hover:bg-toxic-green/5'
                }
              `}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="text-xl font-mono font-bold text-toxic-green mb-2">
                  Virtual Puncher
                </h3>
                <p className="text-sm font-mono text-dark-green">
                  Create a punch card
                </p>
              </div>
              {mode === 'virtual' && (
                <div
                  className="absolute inset-0 rounded-lg border-2 border-toxic-green pointer-events-none"
                  style={{ boxShadow: '0 0 30px rgba(0,255,0,0.5)' }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => setMode('line-based')}
              disabled={isProcessing}
              className={`
                relative p-6 sm:p-8 rounded-lg border-2 transition-all duration-300
                ${mode === 'line-based'
                  ? 'bg-toxic-green/10 border-toxic-green'
                  : 'bg-black/40 border-dark-green hover:border-toxic-green hover:bg-toxic-green/5'
                }
              `}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">💾</div>
                <h3 className="text-xl font-mono font-bold text-toxic-green mb-2">
                  Line-Based
                </h3>
                <p className="text-sm font-mono text-dark-green">
                  Encode full lines as bits
                </p>
              </div>
              {mode === 'line-based' && (
                <div
                  className="absolute inset-0 rounded-lg border-2 border-toxic-green pointer-events-none"
                  style={{ boxShadow: '0 0 30px rgba(0,255,0,0.5)' }}
                />
              )}
            </motion.button>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {mode === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UploadZone onUpload={handleUpload} acceptedFormats={['PNG', 'JPEG', 'WEBP']} maxSizeMB={10} />
              </motion.div>
            )}
            {mode === 'virtual' && (
              <motion.div
                key="virtual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VirtualPuncher onSubmit={handleVirtualSubmit} />
              </motion.div>
            )}
            {mode === 'line-based' && (
              <motion.div
                key="line-based"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LineBasedPuncher onSubmit={handleLineBasedSubmit} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Text */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs sm:text-sm font-mono text-dark-green">
              {mode === 'upload' && 'Supports PNG, JPEG, and WEBP formats (max 10MB)'}
              {mode === 'virtual' && 'Click "Load Demo" to try pre-made patterns like HELLO WORLD'}
              {mode === 'line-based' && 'Each line encoded as 640 bits - try demo patterns: Python, JavaScript, FORTRAN'}
            </p>
          </motion.div>
        </motion.div>

        {/* Processing Overlay */}
        <AnimatePresence>
          {isProcessing && !showSuccessModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center px-4">
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 border-4 border-toxic-green border-t-transparent rounded-full" />
                </motion.div>
                <p className="text-2xl font-creepster text-toxic-green mb-2">
                  Summoning the spirits...
                </p>
                <p className="text-sm font-mono text-dark-green">
                  The resurrection ritual has begun
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center p-8 border-4 border-toxic-green rounded-lg bg-black max-w-md w-full mx-4"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{ boxShadow: '0 0 60px rgba(0,255,0,0.6)' }}
              >
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-3xl font-creepster text-toxic-green mb-2">
                  SUCCESS!
                </h2>
                <p className="text-lg font-mono text-dark-green">
                  The code lives again...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </HauntedLayout>
  );
}
