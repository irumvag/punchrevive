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

      {/* Background image - haunted lab */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url(/haunted-lab-bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      }} />

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

      {/* Floating dust particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: '#0f0',
            borderRadius: '50%',
            opacity: 0.3,
            zIndex: 5,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -1000],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
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
