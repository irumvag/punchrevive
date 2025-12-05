'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import HauntedLayout from '@/src/components/HauntedLayout';
import UploadZone from '@/src/components/UploadZone';
import VirtualPuncher from '@/src/components/VirtualPuncher';
import { uploadPunchCardImage, submitVirtualCard } from '@/src/utils/api-client';

type Mode = 'upload' | 'virtual';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('virtual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Play ambient haunted sound on startup
    try {
      const AC = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      
      // Low rumbling ambient sound
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.value = 60;
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1);
      gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 3);
      
      // Ghost whisper overlay
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(200, ctx.currentTime + 0.5);
      osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 2.5);
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.5);
      gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
      gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
      osc2.start(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 2.5);
    } catch {
      // Audio unavailable
    }
    
    const timer = setTimeout(() => setShowIntro(false), 3500);
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
      console.error('Zombie error:', error);
      toast.error(error instanceof Error ? error.message : '💀 Demon possessed the code—retry?');
      setIsProcessing(false);
    }
  };

  const handleVirtualSubmit = async (pattern: boolean[][]) => {
    setIsProcessing(true);
    try {
      // Use local resurrection API (no AI key needed!)
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
      console.error('Zombie error:', error);
      toast.error(error instanceof Error ? error.message : '💀 Demon possessed the code—retry?');
      setIsProcessing(false);
    }
  };

  const skipIntro = () => setShowIntro(false);

  if (!mounted) return null;

  return (
    <HauntedLayout glowIntensity="high">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ 
          backgroundImage: 'url(/haunted-bg.jpg)',
          filter: 'brightness(0.3) contrast(1.3)'
        }}
      />
      
      {/* DRAMATIC INTRO */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={skipIntro}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 bg-toxic-green"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0, 0.6, 0, 0.4, 0] }}
              transition={{ duration: 2, times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 1] }}
            />
            
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
            }} />

            <div className="text-center relative z-10 px-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 1, type: "spring", damping: 10 }}
              >
                <motion.h1
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-creepster text-toxic-green mb-4"
                  style={{ textShadow: '0 0 20px #0f0, 0 0 40px #0f0, 0 0 60px #0f0' }}
                  animate={{ 
                    textShadow: [
                      '0 0 20px #0f0, 0 0 40px #0f0, 0 0 60px #0f0',
                      '0 0 40px #0f0, 0 0 80px #0f0, 0 0 120px #0f0',
                      '0 0 20px #0f0, 0 0 40px #0f0, 0 0 60px #0f0',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  PunchRevive
                </motion.h1>
              </motion.div>

              <motion.p
                className="text-lg sm:text-2xl md:text-3xl font-mono text-toxic-green mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                style={{ textShadow: '0 0 10px #0f0' }}
              >
                ⚡ RESURRECT THE DEAD CODE ⚡
              </motion.p>

              <motion.div
                className="flex justify-center gap-3 text-3xl sm:text-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {['👻', '🧛', '💀', '🕷️', '🦇'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 2 + i * 0.1, duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                className="text-xs sm:text-sm font-mono text-dark-green mt-8 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2.5 }}
              >
                Click anywhere to enter the crypt...
              </motion.p>
            </div>

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl sm:text-4xl opacity-20"
                style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 10, -10, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
              >
                👻
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center py-8 md:py-12">
        <motion.div
          className="w-full max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 50 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-creepster text-toxic-green mb-3"
              animate={{ 
                textShadow: [
                  '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0',
                  '0 0 20px #0f0, 0 0 40px #0f0, 0 0 60px #0f0',
                  '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              PunchRevive
            </motion.h1>
            <p className="text-base sm:text-lg md:text-xl font-mono text-toxic-green mb-2" style={{ textShadow: '0 0 5px #0f0' }}>
              🧛 Resurrect Dead Code from the Crypt 🧛
            </p>
            <p className="text-xs sm:text-sm opacity-50 font-mono text-dark-green">
              Upload vintage punch cards or create virtual ones
            </p>
          </motion.div>

          {/* Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 md:mb-8">
            <motion.button
              onClick={() => setMode('upload')}
              disabled={isProcessing}
              className={`
                w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 font-mono text-sm sm:text-base uppercase tracking-widest
                border-2 rounded transition-all duration-300 min-h-[48px] sm:min-h-[56px]
                ${mode === 'upload'
                  ? 'bg-toxic-green text-black border-toxic-green font-bold'
                  : 'bg-transparent text-toxic-green border-dark-green hover:border-toxic-green'
                }
              `}
              style={{ boxShadow: mode === 'upload' ? '0 0 30px #0f0, 0 0 60px rgba(0,255,0,0.3)' : 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ☠️ Upload Photo
            </motion.button>
            <motion.button
              onClick={() => setMode('virtual')}
              disabled={isProcessing}
              className={`
                w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 font-mono text-sm sm:text-base uppercase tracking-widest
                border-2 rounded transition-all duration-300 min-h-[48px] sm:min-h-[56px]
                ${mode === 'virtual'
                  ? 'bg-toxic-green text-black border-toxic-green font-bold'
                  : 'bg-transparent text-toxic-green border-dark-green hover:border-toxic-green'
                }
              `}
              style={{ boxShadow: mode === 'virtual' ? '0 0 30px #0f0, 0 0 60px rgba(0,255,0,0.3)' : 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🕳️ Virtual Puncher
            </motion.button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {mode === 'upload' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <UploadZone onUpload={handleUpload} acceptedFormats={['PNG', 'JPEG', 'WEBP']} maxSizeMB={10} />
              </motion.div>
            ) : (
              <motion.div
                key="virtual"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <VirtualPuncher onSubmit={handleVirtualSubmit} />
              </motion.div>
            )}
          </AnimatePresence>

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
                  className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon
                      points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
                      fill="none"
                      stroke="#0f0"
                      strokeWidth="2"
                      style={{ filter: 'drop-shadow(0 0 10px #0f0)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">👻</div>
                </motion.div>
                <motion.p
                  className="text-2xl sm:text-3xl font-creepster text-toxic-green"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ textShadow: '0 0 20px #0f0' }}
                >
                  Summoning the spirits...
                </motion.p>
                <p className="text-xs sm:text-sm font-mono text-dark-green mt-3 sm:mt-4">The resurrection ritual has begun</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center p-8 sm:p-12 border-4 border-toxic-green rounded-lg bg-black relative overflow-hidden max-w-md w-full"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                style={{ boxShadow: '0 0 60px #0f0, 0 0 120px rgba(0,255,0,0.3)' }}
              >
                <motion.div
                  className="absolute inset-0 bg-toxic-green"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="text-6xl sm:text-8xl mb-4 sm:mb-6"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-creepster text-toxic-green mb-3 sm:mb-4" style={{ textShadow: '0 0 30px #0f0' }}>
                  RESURRECTION SUCCESS!
                </h2>
                <p className="text-base sm:text-lg font-mono text-dark-green">The ancient code awakens...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </HauntedLayout>
  );
}
