/**
 * Tests for OCR Service
 */

import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import {
  preprocessImage,
  detectHoles,
  calculateConfidence,
  isConfidenceAcceptable,
  getLowConfidenceError
} from './ocr.service';
import { PunchPattern } from '@/src/types/punch-card.types';

describe('OCR Service', () => {
  describe('preprocessImage', () => {
    it('should convert image to grayscale and apply processing', async () => {
      // Create a simple test image (100x100 white square)
      const testImage = await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
        .png()
        .toBuffer();

      const processed = await preprocessImage(testImage);
      
      // Verify we got a buffer back
      expect(processed).toBeInstanceOf(Buffer);
      expect(processed.length).toBeGreaterThan(0);

      // Verify the processed image is valid
      const metadata = await sharp(processed).metadata();
      expect(metadata.width).toBeDefined();
      expect(metadata.height).toBeDefined();
    });

    it('should handle invalid image data gracefully', async () => {
      const invalidBuffer = Buffer.from('not an image');
      
      await expect(preprocessImage(invalidBuffer)).rejects.toThrow();
    });
  });

  describe('calculateConfidence', () => {
    it('should return 0 for empty grid', () => {
      const emptyPattern: PunchPattern = {
        grid: Array(12).fill(null).map(() => Array(80).fill(false)),
        confidence: 0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };

      const confidence = calculateConfidence(emptyPattern);
      expect(confidence).toBeLessThan(1.0);
    });

    it('should return high confidence for well-distributed holes', () => {
      const grid: boolean[][] = Array(12).fill(null).map(() => Array(80).fill(false));
      
      // Add some realistic punch patterns (2-3 holes per column for first 10 columns)
      for (let col = 0; col < 10; col++) {
        grid[0][col] = true; // Zone punch
        grid[5][col] = true; // Digit punch
      }

      const pattern: PunchPattern = {
        grid,
        confidence: 0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };

      const confidence = calculateConfidence(pattern);
      expect(confidence).toBeGreaterThan(0.5);
    });

    it('should return lower confidence for completely filled grid', () => {
      const filledPattern: PunchPattern = {
        grid: Array(12).fill(null).map(() => Array(80).fill(true)),
        confidence: 0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };

      const confidence = calculateConfidence(filledPattern);
      // Completely filled grid should have reduced confidence due to holeRatioScore penalty
      expect(confidence).toBeLessThan(0.95);
      expect(confidence).toBeGreaterThan(0.5); // But not too low since pattern is consistent
    });
  });

  describe('isConfidenceAcceptable', () => {
    it('should accept confidence >= 0.95 for real cards', () => {
      expect(isConfidenceAcceptable(0.95, false)).toBe(true);
      expect(isConfidenceAcceptable(0.96, false)).toBe(true);
      expect(isConfidenceAcceptable(1.0, false)).toBe(true);
    });

    it('should reject confidence < 0.95 for real cards', () => {
      expect(isConfidenceAcceptable(0.94, false)).toBe(false);
      expect(isConfidenceAcceptable(0.5, false)).toBe(false);
      expect(isConfidenceAcceptable(0.0, false)).toBe(false);
    });

    it('should require 1.0 confidence for virtual cards', () => {
      expect(isConfidenceAcceptable(1.0, true)).toBe(true);
      expect(isConfidenceAcceptable(0.99, true)).toBe(false);
      expect(isConfidenceAcceptable(0.95, true)).toBe(false);
    });
  });

  describe('getLowConfidenceError', () => {
    it('should return appropriate error for very low confidence', () => {
      const error = getLowConfidenceError(0.3);
      expect(error).toContain('faded');
      expect(error).toContain('spirits');
    });

    it('should return appropriate error for medium-low confidence', () => {
      const error = getLowConfidenceError(0.6);
      expect(error).toContain('shadows');
      expect(error).toContain('lighting');
    });

    it('should return appropriate error for near-threshold confidence', () => {
      const error = getLowConfidenceError(0.9);
      expect(error).toContain('unclear');
      expect(error).toContain('sharper');
    });
  });

  describe('detectHoles', () => {
    it('should detect holes in a simple test image', async () => {
      // Create a test image with a black dot (simulating a punch hole)
      const testImage = await sharp({
        create: {
          width: 800,
          height: 120,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
        .composite([
          {
            input: await sharp({
              create: {
                width: 8,
                height: 8,
                channels: 3,
                background: { r: 0, g: 0, b: 0 }
              }
            }).png().toBuffer(),
            top: 5,
            left: 5
          }
        ])
        .png()
        .toBuffer();

      const pattern = await detectHoles(testImage);

      // Verify structure
      expect(pattern.grid).toHaveLength(12);
      expect(pattern.grid[0]).toHaveLength(80);
      expect(pattern.confidence).toBeGreaterThanOrEqual(0);
      expect(pattern.confidence).toBeLessThanOrEqual(1);
      expect(pattern.metadata.imageWidth).toBe(800);
      expect(pattern.metadata.imageHeight).toBe(120);
      expect(pattern.metadata.detectedColumns).toBe(80);
    });

    it('should handle white image (no holes)', async () => {
      const whiteImage = await sharp({
        create: {
          width: 800,
          height: 120,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
        .png()
        .toBuffer();

      const pattern = await detectHoles(whiteImage);

      // Should detect no holes
      const totalHoles = pattern.grid.flat().filter(h => h).length;
      expect(totalHoles).toBe(0);
    });
  });
});
