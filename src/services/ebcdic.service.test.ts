/**
 * Unit tests for EBCDIC Decoder Service
 */

import { describe, it, expect } from 'vitest';
import { EBCDICService } from './ebcdic.service';
import type { PunchPattern } from '@/src/types/punch-card.types';

describe('EBCDICService', () => {
  const service = new EBCDICService();

  describe('decode', () => {
    it('should decode letter A (12-1 punch) correctly with IBM029', () => {
      // Create a pattern with punch in row 0 (12) and row 3 (1)
      const grid: boolean[][] = Array(12).fill(null).map(() => Array(80).fill(false));
      grid[0][0] = true; // Row 12
      grid[3][0] = true; // Row 1
      
      const pattern: PunchPattern = {
        grid,
        confidence: 1.0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };
      
      const result = service.decode(pattern, 'IBM029');
      expect(result.sourceCode[0]).toBe('A');
      expect(result.encoding).toBe('IBM029');
    });

    it('should decode digit 5 correctly', () => {
      const grid: boolean[][] = Array(12).fill(null).map(() => Array(80).fill(false));
      grid[7][0] = true; // Row 5 (row mapping: 0=12, 1=11, 2=0, 3=1, 4=2, 5=3, 6=4, 7=5...)
      
      const pattern: PunchPattern = {
        grid,
        confidence: 1.0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };
      
      const result = service.decode(pattern, 'IBM029');
      expect(result.sourceCode[0]).toBe('5');
    });

    it('should decode space (no punches) correctly', () => {
      const grid: boolean[][] = Array(12).fill(null).map(() => Array(80).fill(false));
      
      const pattern: PunchPattern = {
        grid,
        confidence: 1.0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };
      
      const result = service.decode(pattern, 'IBM029');
      expect(result.sourceCode.trim()).toBe('');
    });

    it('should handle unknown punch patterns with placeholder', () => {
      const grid: boolean[][] = Array(12).fill(null).map(() => Array(80).fill(false));
      // Create an invalid pattern (all rows punched)
      for (let row = 0; row < 12; row++) {
        grid[row][0] = true;
      }
      
      const pattern: PunchPattern = {
        grid,
        confidence: 1.0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };
      
      const result = service.decode(pattern, 'IBM029');
      expect(result.sourceCode[0]).toBe('�');
    });
  });

  describe('detectLanguage', () => {
    it('should detect FORTRAN from keywords', () => {
      const sourceCode = 'PROGRAM HELLO\n  WRITE(*,*) "HELLO"\nEND PROGRAM';
      const language = service.detectLanguage(sourceCode);
      expect(language).toBe('FORTRAN');
    });

    it('should detect COBOL from keywords', () => {
      const sourceCode = 'IDENTIFICATION DIVISION.\nPROCEDURE DIVISION.\n  DISPLAY "HELLO".';
      const language = service.detectLanguage(sourceCode);
      expect(language).toBe('COBOL');
    });

    it('should detect BASIC from keywords and line numbers', () => {
      const sourceCode = '10 PRINT "HELLO"\n20 GOTO 10\n30 END';
      const language = service.detectLanguage(sourceCode);
      expect(language).toBe('BASIC');
    });

    it('should detect ASSEMBLER from mnemonics', () => {
      const sourceCode = 'MOV AX, BX\nADD CX, DX\nRET';
      const language = service.detectLanguage(sourceCode);
      expect(language).toBe('ASSEMBLER');
    });

    it('should return UNKNOWN for unrecognizable code', () => {
      const sourceCode = 'xyz abc def 123';
      const language = service.detectLanguage(sourceCode);
      expect(language).toBe('UNKNOWN');
    });
  });

  describe('autoDetectEncoding', () => {
    it('should select encoding with higher coherence score', () => {
      // Create a pattern that decodes to valid FORTRAN with IBM029
      const grid: boolean[][] = Array(12).fill(null).map(() => Array(80).fill(false));
      
      // Spell "PROGRAM" using IBM029 encoding
      // P = 11-7, R = 11-9, O = 11-6, G = 12-7, R = 11-9, A = 12-1, M = 11-4
      const punchPatterns = [
        [1, 10], // P: rows 11, 7
        [1, 11], // R: rows 11, 9
        [1, 9],  // O: rows 11, 6
        [0, 10], // G: rows 12, 7
        [1, 11], // R: rows 11, 9
        [0, 3],  // A: rows 12, 1
        [1, 7]   // M: rows 11, 4
      ];
      
      punchPatterns.forEach(([row1, row2], col) => {
        grid[row1][col] = true;
        grid[row2][col] = true;
      });
      
      const pattern: PunchPattern = {
        grid,
        confidence: 1.0,
        metadata: {
          imageWidth: 800,
          imageHeight: 120,
          detectedColumns: 80
        }
      };
      
      const encoding = service.autoDetectEncoding(pattern);
      expect(encoding).toBe('IBM029');
    });
  });
});
