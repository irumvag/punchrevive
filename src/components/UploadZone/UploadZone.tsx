'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import type { UploadZoneProps } from '@/src/types/ui.types';

/**
 * UploadZone - Dramatic drag-and-drop with haunted effects
 */
export default function UploadZone({ onUpload, acceptedFormats, maxSizeMB }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showLightning, setShowLightning] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const playSound = useCallback((type: 'drop' | 'error') => {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'drop') {
        // Thunder/ghost moan
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else {
        // Error buzz
        osc.type = 'square';
        osc.frequency.value = 100;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio unavailable
    }
  }, []);

  const triggerLightning = useCallback(() => {
    setShowLightning(true);
    playSound('drop');
    setTimeout(() => setShowLightning(false), 150);
    setTimeout(() => {
      setShowLightning(true);
      setTimeout(() => setShowLightning(false), 100);
    }, 200);
  }, [playSound]);

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const validTypes = acceptedFormats.map(f => `image/${f.toLowerCase()}`);
      if (!validTypes.includes(file.type)) {
        throw new Error('⚠️ This artifact must be PNG, JPEG, or WEBP');
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`⚠️ File too large (max ${maxSizeMB}MB)`);
      }

      triggerLightning();

      const interval = setInterval(() => {
        setUploadProgress(p => p >= 90 ? p : p + 15);
      }, 100);

      await onUpload(file);
      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    } catch (err) {
      playSound('error');
      setError(err instanceof Error ? err.message : '💀 Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload, acceptedFormats, maxSizeMB, triggerLightning, playSound]);

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) handleFileUpload(files[0]);
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'] },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className="upload-zone-container">
      {/* Lightning flash */}
      <AnimatePresence>
        {showLightning && (
          <motion.div
            className="lightning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Main dropzone */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />

        {/* Animated border */}
        <div className="border-glow" />

        {/* Corner decorations */}
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />

        {/* Content */}
        <div className="dropzone-content">
          {isUploading ? (
            <div className="uploading-state">
              <motion.div
                className="upload-icon"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                🔮
              </motion.div>
              <p className="upload-text">Channeling ancient energies...</p>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="progress-text">{uploadProgress}% summoned</p>
            </div>
          ) : isDragActive ? (
            <motion.div
              className="drag-active-state"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <span className="drag-icon">⚡</span>
              <p className="drag-text">Release the artifact!</p>
            </motion.div>
          ) : (
            <div className="idle-state">
              <motion.div
                className="upload-icon-container"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="main-icon">📜</span>
                <span className="ghost-icon">👻</span>
              </motion.div>
              <p className="main-text">Drop your punch card here</p>
              <p className="sub-text">or click to browse the crypt</p>
              <div className="format-info">
                <span>PNG</span>
                <span>•</span>
                <span>JPEG</span>
                <span>•</span>
                <span>WEBP</span>
                <span>•</span>
                <span>Max {maxSizeMB}MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile camera button */}
      {isMobile && !isUploading && (
        <label className="camera-btn">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden-input"
          />
          📷 Capture with Camera
        </label>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="error-icon">💀</span>
            <span className="error-text">{error}</span>
            <button onClick={() => setError(null)} className="retry-btn">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .upload-zone-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        .lightning {
          position: fixed;
          inset: 0;
          background: #0f0;
          z-index: 100;
          pointer-events: none;
        }

        .dropzone {
          position: relative;
          min-height: 280px;
          border: 3px dashed #003300;
          border-radius: 16px;
          background: linear-gradient(180deg, rgba(0,20,0,0.5) 0%, rgba(0,0,0,0.8) 100%);
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .dropzone:hover {
          border-color: #0f0;
          box-shadow: 0 0 30px rgba(0,255,0,0.2);
        }

        .dropzone.active {
          border-color: #0f0;
          border-style: solid;
          background: rgba(0,255,0,0.1);
          box-shadow: 0 0 50px rgba(0,255,0,0.4), inset 0 0 50px rgba(0,255,0,0.1);
          transform: scale(1.02);
        }

        .dropzone.uploading {
          pointer-events: none;
          opacity: 0.8;
        }

        .border-glow {
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: linear-gradient(45deg, transparent, #0f0, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .dropzone.active .border-glow {
          opacity: 0.3;
          animation: rotate-glow 2s linear infinite;
        }

        @keyframes rotate-glow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #0f0;
          border-style: solid;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .dropzone.active .corner,
        .dropzone:hover .corner {
          opacity: 1;
        }

        .corner-tl { top: 8px; left: 8px; border-width: 3px 0 0 3px; }
        .corner-tr { top: 8px; right: 8px; border-width: 3px 3px 0 0; }
        .corner-bl { bottom: 8px; left: 8px; border-width: 0 0 3px 3px; }
        .corner-br { bottom: 8px; right: 8px; border-width: 0 3px 3px 0; }

        .dropzone-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 280px;
          padding: 2rem;
          text-align: center;
        }

        .idle-state, .drag-active-state, .uploading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-icon-container {
          position: relative;
          font-size: 4rem;
        }

        .main-icon {
          display: block;
        }

        .ghost-icon {
          position: absolute;
          top: -10px;
          right: -20px;
          font-size: 1.5rem;
          opacity: 0.6;
        }

        .main-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.3rem;
          color: #0f0;
          text-shadow: 0 0 10px #0f0;
          margin: 0;
        }

        .sub-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          color: #003300;
          margin: 0;
        }

        .format-info {
          display: flex;
          gap: 0.5rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #002200;
          margin-top: 0.5rem;
        }

        .drag-icon {
          font-size: 5rem;
          filter: drop-shadow(0 0 20px #0f0);
        }

        .drag-text {
          font-family: 'Creepster', cursive;
          font-size: 1.8rem;
          color: #0f0;
          text-shadow: 0 0 20px #0f0;
          margin: 0;
        }

        .upload-icon {
          font-size: 4rem;
        }

        .upload-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.1rem;
          color: #0f0;
          text-shadow: 0 0 10px #0f0;
          margin: 0;
        }

        .progress-bar {
          width: 200px;
          height: 8px;
          background: #001100;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #003300;
        }

        .progress-fill {
          height: 100%;
          background: #0f0;
          box-shadow: 0 0 10px #0f0;
        }

        .progress-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: #003300;
          margin: 0;
        }

        .camera-btn {
          display: block;
          width: 100%;
          margin-top: 1rem;
          padding: 1rem;
          background: transparent;
          border: 2px solid #0f0;
          border-radius: 8px;
          color: #0f0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .camera-btn:hover {
          background: rgba(0,255,0,0.1);
          box-shadow: 0 0 20px rgba(0,255,0,0.3);
        }

        .hidden-input {
          display: none;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(50,0,0,0.8);
          border: 2px solid #ff4444;
          border-radius: 8px;
        }

        .error-icon {
          font-size: 1.5rem;
        }

        .error-text {
          flex: 1;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          color: #ff6666;
        }

        .retry-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #ff4444;
          border-radius: 4px;
          color: #ff4444;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .retry-btn:hover {
          background: rgba(255,68,68,0.2);
        }

        @media (max-width: 768px) {
          .dropzone { min-height: 220px; }
          .main-text { font-size: 1.1rem; }
          .upload-icon-container { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
}
