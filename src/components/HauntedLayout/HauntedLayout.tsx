'use client';

import React from 'react';
import type { HauntedLayoutProps } from '@/src/types/ui.types';

/**
 * HauntedLayout Component
 * 
 * Provides the haunted laboratory background and theme wrapper for all pages.
 * Features cobwebs, dusty CRTs, scattered papers, and glowing vials as background elements.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */
export default function HauntedLayout({
  children,
  showCobwebs = true,
  glowIntensity = 'medium',
}: HauntedLayoutProps) {
  // Map glow intensity to opacity values
  const glowOpacity = {
    low: 0.3,
    medium: 0.5,
    high: 0.7,
  }[glowIntensity];

  return (
    <div className="min-h-screen relative overflow-hidden bg-haunted-black">
      {/* Haunted laboratory background layers */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-green/20 to-haunted-black" />
        
        {/* Dusty CRT monitors scattered in background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-24 border-2 border-toxic-green/30 rounded-sm transform -rotate-12">
            <div className="w-full h-full bg-toxic-green/5 animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute top-40 right-20 w-40 h-28 border-2 border-toxic-green/30 rounded-sm transform rotate-6">
            <div className="w-full h-full bg-toxic-green/5 animate-pulse" style={{ animationDuration: '4s' }} />
          </div>
          <div className="absolute bottom-32 left-1/4 w-36 h-26 border-2 border-toxic-green/30 rounded-sm transform rotate-3">
            <div className="w-full h-full bg-toxic-green/5 animate-pulse" style={{ animationDuration: '5s' }} />
          </div>
        </div>

        {/* Scattered papers */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-1/3 w-20 h-24 bg-dark-green/40 transform -rotate-45 border border-toxic-green/20" />
          <div className="absolute top-2/3 right-1/4 w-16 h-20 bg-dark-green/40 transform rotate-12 border border-toxic-green/20" />
          <div className="absolute bottom-1/4 left-1/2 w-18 h-22 bg-dark-green/40 transform -rotate-12 border border-toxic-green/20" />
        </div>

        {/* Glowing vials */}
        <div className="absolute inset-0" style={{ opacity: glowOpacity }}>
          <div className="absolute top-20 right-1/3 w-4 h-8 bg-toxic-green rounded-full blur-sm animate-pulse" style={{ animationDuration: '2s' }} />
          <div className="absolute bottom-40 left-1/4 w-3 h-6 bg-toxic-green rounded-full blur-sm animate-pulse" style={{ animationDuration: '2.5s' }} />
          <div className="absolute top-1/2 right-1/4 w-5 h-10 bg-toxic-green rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }} />
        </div>

        {/* Cobwebs */}
        {showCobwebs && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* Top-left cobweb */}
            <svg className="absolute top-0 left-0 w-32 h-32" viewBox="0 0 100 100">
              <path
                d="M 0 0 L 50 30 L 100 0 M 0 0 L 30 50 L 0 100 M 0 0 L 40 40 M 20 0 L 30 30 M 0 20 L 30 30"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-toxic-green/60"
              />
            </svg>
            
            {/* Top-right cobweb */}
            <svg className="absolute top-0 right-0 w-32 h-32 transform scale-x-[-1]" viewBox="0 0 100 100">
              <path
                d="M 0 0 L 50 30 L 100 0 M 0 0 L 30 50 L 0 100 M 0 0 L 40 40 M 20 0 L 30 30 M 0 20 L 30 30"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-toxic-green/60"
              />
            </svg>

            {/* Bottom-left cobweb */}
            <svg className="absolute bottom-0 left-0 w-24 h-24 transform scale-y-[-1]" viewBox="0 0 100 100">
              <path
                d="M 0 0 L 50 30 L 100 0 M 0 0 L 30 50 L 0 100 M 0 0 L 40 40"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-toxic-green/60"
              />
            </svg>
          </div>
        )}

        {/* Scanline effect for CRT aesthetic */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #0f0 2px, #0f0 4px)',
            }}
          />
        </div>

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-haunted-black opacity-60" />
      </div>

      {/* Content container */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
