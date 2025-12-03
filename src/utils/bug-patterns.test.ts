/**
 * Tests for bug pattern utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateBugType,
  suggestBugType,
  matchesBugType,
  getSpookyMessage,
  isValidBugFix,
  formatBugLocation,
  extractCodeContext,
  BUG_PATTERNS,
  BUG_KEYWORDS,
  DEFAULT_BUG_SEVERITY,
  SPOOKY_BUG_MESSAGES,
} from './bug-patterns';

describe('bug-patterns', () => {
  describe('validateBugType', () => {
    it('should validate infinite loop patterns', () => {
      expect(validateBugType('infinite_loop', 'while(true) { }')).toBe(true);
      expect(validateBugType('infinite_loop', 'while(1) { }')).toBe(true);
      expect(validateBugType('infinite_loop', 'for(;;) { }')).toBe(true);
      expect(validateBugType('infinite_loop', 'if(x > 0) { }')).toBe(false);
    });

    it('should validate memory leak patterns', () => {
      expect(validateBugType('memory_leak', 'file = open("data.txt")')).toBe(true);
      expect(validateBugType('memory_leak', 'ptr = malloc(100)')).toBe(true);
      expect(validateBugType('memory_leak', 'obj = new Object()')).toBe(true);
      expect(validateBugType('memory_leak', 'x = 5')).toBe(false);
    });

    it('should validate syntax error patterns', () => {
      expect(validateBugType('syntax_error', 'function test(')).toBe(true);
      expect(validateBugType('syntax_error', '{ code here')).toBe(true);
      expect(validateBugType('syntax_error', '[array')).toBe(true);
    });

    it('should validate type mismatch patterns', () => {
      expect(validateBugType('type_mismatch', '"hello" + 5')).toBe(true);
      expect(validateBugType('type_mismatch', '10 * "world"')).toBe(true);
      expect(validateBugType('type_mismatch', '5 + 10')).toBe(false);
    });
  });

  describe('suggestBugType', () => {
    it('should suggest infinite_loop for loop patterns', () => {
      expect(suggestBugType('while(true) { }')).toBe('infinite_loop');
      expect(suggestBugType('for(;;) { }')).toBe('infinite_loop');
    });

    it('should suggest memory_leak for resource patterns', () => {
      expect(suggestBugType('file = open("test.txt")')).toBe('memory_leak');
      expect(suggestBugType('ptr = malloc(100)')).toBe('memory_leak');
    });

    it('should return null for unknown patterns', () => {
      // Use patterns that clearly don't match any bug type
      expect(suggestBugType('// This is a comment')).toBeNull();
      expect(suggestBugType('return 42;')).toBeNull();
    });
  });

  describe('matchesBugType', () => {
    it('should match infinite loop descriptions', () => {
      expect(matchesBugType('infinite_loop', 'Loop has no termination condition')).toBe(true);
      expect(matchesBugType('infinite_loop', 'Endless while loop detected')).toBe(true);
      expect(matchesBugType('infinite_loop', 'Variable not defined')).toBe(false);
    });

    it('should match memory leak descriptions', () => {
      expect(matchesBugType('memory_leak', 'Memory allocation not freed')).toBe(true);
      expect(matchesBugType('memory_leak', 'Resource leak detected')).toBe(true);
      expect(matchesBugType('memory_leak', 'Syntax error found')).toBe(false);
    });

    it('should match undefined variable descriptions', () => {
      expect(matchesBugType('undefined_variable', 'Variable x is undefined')).toBe(true);
      expect(matchesBugType('undefined_variable', 'Undeclared variable used')).toBe(true);
    });
  });

  describe('getSpookyMessage', () => {
    it('should return a spooky message for each bug type', () => {
      const message = getSpookyMessage('infinite_loop');
      expect(SPOOKY_BUG_MESSAGES.infinite_loop).toContain(message);
    });

    it('should return different messages for different bug types', () => {
      const loopMessage = getSpookyMessage('infinite_loop');
      const leakMessage = getSpookyMessage('memory_leak');
      
      expect(SPOOKY_BUG_MESSAGES.infinite_loop).toContain(loopMessage);
      expect(SPOOKY_BUG_MESSAGES.memory_leak).toContain(leakMessage);
    });

    it('should return valid messages for all bug types', () => {
      const bugTypes: Array<keyof typeof SPOOKY_BUG_MESSAGES> = [
        'infinite_loop',
        'memory_leak',
        'syntax_error',
        'undefined_variable',
        'type_mismatch',
      ];

      bugTypes.forEach((bugType) => {
        const message = getSpookyMessage(bugType);
        expect(message).toBeTruthy();
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('isValidBugFix', () => {
    it('should validate proper bug fix descriptions', () => {
      expect(isValidBugFix('Added break statement to exit loop')).toBe(true);
      expect(isValidBugFix('Closed file handle after reading')).toBe(true);
      expect(isValidBugFix('Fixed syntax error by adding semicolon')).toBe(true);
    });

    it('should reject empty or too short descriptions', () => {
      expect(isValidBugFix('')).toBe(false);
      expect(isValidBugFix('Fixed')).toBe(false);
      expect(isValidBugFix('   ')).toBe(false);
    });

    it('should reject non-descriptive fixes', () => {
      expect(isValidBugFix('12345')).toBe(false);
      expect(isValidBugFix('...')).toBe(false);
    });
  });

  describe('formatBugLocation', () => {
    it('should format bug location correctly', () => {
      expect(formatBugLocation(10, 5)).toBe('Line 10, Column 5');
      expect(formatBugLocation(1, 0)).toBe('Line 1, Column 0');
      expect(formatBugLocation(100, 50)).toBe('Line 100, Column 50');
    });
  });

  describe('extractCodeContext', () => {
    it('should extract code context around a line', () => {
      const code = 'line1\nline2\nline3\nline4\nline5';
      const context = extractCodeContext(code, 3, 1);
      
      expect(context).toContain('line2');
      expect(context).toContain('line3');
      expect(context).toContain('line4');
    });

    it('should handle edge cases at start of file', () => {
      const code = 'line1\nline2\nline3';
      const context = extractCodeContext(code, 1, 2);
      
      expect(context).toContain('line1');
      expect(context).toContain('line2');
    });

    it('should handle edge cases at end of file', () => {
      const code = 'line1\nline2\nline3';
      const context = extractCodeContext(code, 3, 2);
      
      expect(context).toContain('line2');
      expect(context).toContain('line3');
    });
  });

  describe('BUG_PATTERNS', () => {
    it('should have patterns for all bug types', () => {
      expect(BUG_PATTERNS.infinite_loop).toBeDefined();
      expect(BUG_PATTERNS.memory_leak).toBeDefined();
      expect(BUG_PATTERNS.syntax_error).toBeDefined();
      expect(BUG_PATTERNS.undefined_variable).toBeDefined();
      expect(BUG_PATTERNS.type_mismatch).toBeDefined();
    });

    it('should have at least one pattern per bug type', () => {
      Object.values(BUG_PATTERNS).forEach((patterns) => {
        expect(patterns.length).toBeGreaterThan(0);
      });
    });
  });

  describe('BUG_KEYWORDS', () => {
    it('should have keywords for all bug types', () => {
      expect(BUG_KEYWORDS.infinite_loop).toBeDefined();
      expect(BUG_KEYWORDS.memory_leak).toBeDefined();
      expect(BUG_KEYWORDS.syntax_error).toBeDefined();
      expect(BUG_KEYWORDS.undefined_variable).toBeDefined();
      expect(BUG_KEYWORDS.type_mismatch).toBeDefined();
    });

    it('should have at least one keyword per bug type', () => {
      Object.values(BUG_KEYWORDS).forEach((keywords) => {
        expect(keywords.length).toBeGreaterThan(0);
      });
    });
  });

  describe('DEFAULT_BUG_SEVERITY', () => {
    it('should have severity for all bug types', () => {
      expect(DEFAULT_BUG_SEVERITY.infinite_loop).toBe('critical');
      expect(DEFAULT_BUG_SEVERITY.memory_leak).toBe('critical');
      expect(DEFAULT_BUG_SEVERITY.syntax_error).toBe('critical');
      expect(DEFAULT_BUG_SEVERITY.undefined_variable).toBe('warning');
      expect(DEFAULT_BUG_SEVERITY.type_mismatch).toBe('warning');
    });
  });

  describe('SPOOKY_BUG_MESSAGES', () => {
    it('should have multiple messages for each bug type', () => {
      Object.values(SPOOKY_BUG_MESSAGES).forEach((messages) => {
        expect(messages.length).toBeGreaterThan(0);
        messages.forEach((message) => {
          expect(message.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have horror-themed messages', () => {
      const allMessages = Object.values(SPOOKY_BUG_MESSAGES).flat();
      const horrorWords = ['demon', 'vampire', 'ghost', 'specter', 'zombie', 'phantom', 'wraith', 'curse', 'entity', 'poltergeist'];
      
      allMessages.forEach((message) => {
        const hasHorrorWord = horrorWords.some((word) => 
          message.toLowerCase().includes(word)
        );
        expect(hasHorrorWord).toBe(true);
      });
    });
  });
});
