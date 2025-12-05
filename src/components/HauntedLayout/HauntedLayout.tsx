'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { HauntedLayoutProps } from '@/src/types/ui.types';

/**
 * HauntedLayout - Immersive haunted laboratory environment
 * Matches mockup: dark desk, CRT, cobwebs, papers, lamp, vials
 */
export default function HauntedLayout({
  children,
  showCobwebs = true,
  glowIntensity = 'medium',
}: HauntedLayoutProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);
  const [lightningFlash, setLightningFlash] = useState(false);

  useEffect(() => {
    // Create floating dust particles
    const dust = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
    }));
    setParticles(dust);
  }, []);

  // Random lightning
  useEffect(() => {
    const triggerLightning = () => {
      if (Math.random() > 0.7) {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 100);
        setTimeout(() => {
          if (Math.random() > 0.5) {
            setLightningFlash(true);
            setTimeout(() => setLightningFlash(false), 80);
          }
        }, 150);
      }
    };
    const interval = setInterval(triggerLightning, 10000 + Math.random() * 15000);
    return () => clearInterval(interval);
  }, []);

  const glowOpacity = { low: 0.2, medium: 0.4, high: 0.6 }[glowIntensity];

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
    }}>
      {/* Lightning flash */}
      {lightningFlash && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 255, 0, 0.15)',
          zIndex: 100,
          pointerEvents: 'none',
        }} />
      )}

      {/* Animated background layers */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center bottom, #001a00 0%, #000000 70%)',
        zIndex: 0,
      }} />

      {/* Fog layer */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(0, 26, 0, 0.6), transparent)',
          zIndex: 0,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grass silhouette at bottom */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          zIndex: 1,
        }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          viewBox="0 0 1200 150"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.3))',
          }}
        >
          <defs>
            <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#0a3d0a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#001a00', stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,50 Q50,30 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50 T1100,50 T1200,50 L1200,150 L0,150 Z"
            fill="url(#grassGradient)"
            opacity="0.7"
          />
          <path
            d="M0,70 Q60,50 120,70 T240,70 T360,70 T480,70 T600,70 T720,70 T840,70 T960,70 T1080,70 T1200,70 L1200,150 L0,150 Z"
            fill="url(#grassGradient)"
            opacity="0.5"
          />
          <path
            d="M0,90 Q80,70 160,90 T320,90 T480,90 T640,90 T800,90 T960,90 T1120,90 T1200,90 L1200,150 L0,150 Z"
            fill="url(#grassGradient)"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Dark overlay for readability */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1,
      }} />

      {/* CRT ambient glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '5%',
        width: '400px',
        height: '300px',
        background: `radial-gradient(ellipse, rgba(0,255,0,${glowOpacity * 0.15}) 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.02) 2px, rgba(0,255,0,0.02) 4px)',
        pointerEvents: 'none',
        zIndex: 50,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
        zIndex: 40,
      }} />

      {/* Floating particles - fireflies and dust */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#0f0' : 'rgba(0, 255, 0, 0.6)',
            borderRadius: '50%',
            opacity: 0.3,
            zIndex: 5,
            filter: p.id % 3 === 0 ? 'blur(2px)' : 'blur(1px)',
            boxShadow: p.id % 3 === 0 ? '0 0 10px rgba(0, 255, 0, 0.8)' : 'none',
          }}
          animate={{
            y: [0, -1000],
            x: [0, Math.sin(p.id) * 50, 0],
            opacity: p.id % 3 === 0 ? [0.2, 0.8, 0.2] : [0.1, 0.4, 0.1],
            scale: p.id % 3 === 0 ? [1, 1.5, 1] : [1, 1, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.id * 0.5,
          }}
        />
      ))}

      {/* Cobwebs overlay */}
      {showCobwebs && (
        <>
          <svg style={{ position: 'fixed', top: 0, left: 0, width: '250px', height: '250px', zIndex: 10, opacity: 0.2 }} viewBox="0 0 100 100" fill="none">
            <path d="M0 0 Q50 30 100 0" stroke="#0f0" strokeWidth="0.3"/>
            <path d="M0 0 Q30 50 0 100" stroke="#0f0" strokeWidth="0.3"/>
            <path d="M0 0 L60 60" stroke="#0f0" strokeWidth="0.3"/>
            <path d="M0 20 Q30 35 20 0" stroke="#0f0" strokeWidth="0.2"/>
            <path d="M0 40 Q40 50 40 0" stroke="#0f0" strokeWidth="0.2"/>
            <path d="M20 0 Q35 30 0 20" stroke="#0f0" strokeWidth="0.2"/>
          </svg>
          <svg style={{ position: 'fixed', top: 0, right: 0, width: '250px', height: '250px', zIndex: 10, opacity: 0.2, transform: 'scaleX(-1)' }} viewBox="0 0 100 100" fill="none">
            <path d="M0 0 Q50 30 100 0" stroke="#0f0" strokeWidth="0.3"/>
            <path d="M0 0 Q30 50 0 100" stroke="#0f0" strokeWidth="0.3"/>
            <path d="M0 0 L60 60" stroke="#0f0" strokeWidth="0.3"/>
            <path d="M0 20 Q30 35 20 0" stroke="#0f0" strokeWidth="0.2"/>
          </svg>
        </>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 20, minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
