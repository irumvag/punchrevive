/**
 * Tests for Translation Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import TranslationService from './translation.service';
import type { LegacyLanguage, ModernLanguage } from '../types/punch-card.types';

// Mock OpenAI and Anthropic
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    })),
  };
});

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn(),
      },
    })),
  };
});

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TranslationService({
      openaiApiKey: 'test-openai-key',
      claudeApiKey: 'test-claude-key',
    });
  });

  describe('translate', () => {
    it('should translate FORTRAN to Python successfully', async () => {
      // Mock OpenAI response
      const mockResponse = {
        translatedCode: 'print("Hello, World!")',
        bugs: [],
      };

      vi.spyOn(service as any, 'translateWithOpenAI').mockResolvedValue(mockResponse);

      const result = await service.translate(
        'PROGRAM HELLO\n  PRINT *, "Hello, World!"\nEND PROGRAM',
        'FORTRAN',
        'Python'
      );

      expect(result.translatedCode).toBe('print("Hello, World!")');
      expect(result.bugs).toHaveLength(0);
      expect(result.exorcismReport).toContain('No demons detected');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect and report bugs', async () => {
      // Mock OpenAI response with bugs
      const mockResponse = {
        translatedCode: 'x = 10\nprint(x)',
        bugs: [
          {
            type: 'undefined_variable' as const,
            line: 1,
            column: 0,
            snippet: 'x = 10',
            description: 'Variable x used before declaration',
            fix: 'Added variable declaration',
          },
        ],
      };

      vi.spyOn(service as any, 'translateWithOpenAI').mockResolvedValue(mockResponse);

      const result = await service.translate('10 PRINT X', 'BASIC', 'Python');

      expect(result.bugs).toHaveLength(1);
      expect(result.bugs[0].type).toBe('undefined_variable');
      expect(result.bugs[0].spookyMessage).toBeTruthy();
      expect(result.bugs[0].spookyMessage.length).toBeGreaterThan(0);
      expect(result.exorcismReport).toContain('EXORCISM REPORT');
      expect(result.exorcismReport).toContain(result.bugs[0].spookyMessage);
    });

    it('should generate proper exorcism report for multiple bugs', async () => {
      const mockResponse = {
        translatedCode: 'fixed_code',
        bugs: [
          {
            type: 'infinite_loop' as const,
            line: 5,
            column: 2,
            snippet: 'while True:',
            description: 'Loop has no exit condition',
            fix: 'Added break condition',
          },
          {
            type: 'memory_leak' as const,
            line: 10,
            column: 0,
            snippet: 'file = open("data.txt")',
            description: 'File not closed',
            fix: 'Added file.close()',
          },
        ],
      };

      vi.spyOn(service as any, 'translateWithOpenAI').mockResolvedValue(mockResponse);

      const result = await service.translate('SOME CODE', 'COBOL', 'JavaScript');

      expect(result.bugs).toHaveLength(2);
      expect(result.exorcismReport).toContain('2 curses banished');
      // Check that both bug messages are in the report (they're randomized)
      expect(result.exorcismReport).toContain(result.bugs[0].spookyMessage);
      expect(result.exorcismReport).toContain(result.bugs[1].spookyMessage);
    });

    it('should fallback to Claude if OpenAI fails', async () => {
      const mockClaudeResponse = {
        translatedCode: 'console.log("Hello");',
        bugs: [],
      };

      vi.spyOn(service as any, 'translateWithOpenAI').mockRejectedValue(
        new Error('OpenAI API error')
      );
      vi.spyOn(service as any, 'translateWithClaude').mockResolvedValue(mockClaudeResponse);

      const result = await service.translate('PRINT "Hello"', 'BASIC', 'JavaScript');

      expect(result.translatedCode).toBe('console.log("Hello");');
      expect(result.bugs).toHaveLength(0);
    });

    it('should throw error if both providers fail', async () => {
      vi.spyOn(service as any, 'translateWithOpenAI').mockRejectedValue(
        new Error('OpenAI error')
      );
      vi.spyOn(service as any, 'translateWithClaude').mockRejectedValue(
        new Error('Claude error')
      );

      await expect(
        service.translate('CODE', 'FORTRAN', 'Python')
      ).rejects.toThrow('The AI spirits are unavailable');
    });
  });

  describe('parseResponse', () => {
    it('should parse valid JSON response', () => {
      const jsonResponse = JSON.stringify({
        translatedCode: 'print("test")',
        bugs: [],
      });

      const result = (service as any).parseResponse(jsonResponse);

      expect(result.translatedCode).toBe('print("test")');
      expect(result.bugs).toEqual([]);
    });

    it('should parse JSON from markdown code blocks', () => {
      const markdownResponse = '```json\n{"translatedCode": "code", "bugs": []}\n```';

      const result = (service as any).parseResponse(markdownResponse);

      expect(result.translatedCode).toBe('code');
      expect(result.bugs).toEqual([]);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => {
        (service as any).parseResponse('invalid json');
      }).toThrow('Failed to parse AI response');
    });

    it('should throw error for missing translatedCode', () => {
      const invalidResponse = JSON.stringify({ bugs: [] });

      expect(() => {
        (service as any).parseResponse(invalidResponse);
      }).toThrow('missing translatedCode');
    });
  });

  describe('generateExorcismReport', () => {
    it('should generate clean report when no bugs', () => {
      const report = (service as any).generateExorcismReport([]);

      expect(report).toContain('No demons detected - code is pure');
    });

    it('should generate detailed report for bugs', () => {
      const bugs = [
        {
          id: 'bug-1',
          type: 'syntax_error',
          severity: 'critical',
          location: { line: 5, column: 10, snippet: 'bad syntax' },
          description: 'Missing semicolon',
          spookyMessage: 'Syntax error ghost exorcised',
          fix: 'Added semicolon',
        },
      ];

      const report = (service as any).generateExorcismReport(bugs);

      expect(report).toContain('EXORCISM REPORT');
      expect(report).toContain('1 curse banished');
      expect(report).toContain('Syntax error ghost exorcised');
      expect(report).toContain('Line 5, Column 10');
      expect(report).toContain('Missing semicolon');
    });
  });

  describe('calculateConfidence', () => {
    it('should return high confidence for clean code', () => {
      const confidence = (service as any).calculateConfidence('valid code here', []);

      expect(confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('should reduce confidence for critical bugs', () => {
      const bugs = [
        {
          id: 'bug-1',
          severity: 'critical',
          type: 'infinite_loop',
          location: { line: 1, column: 0, snippet: '' },
          description: '',
          spookyMessage: '',
          fix: '',
        },
      ];

      const confidence = (service as any).calculateConfidence('code', bugs);

      expect(confidence).toBeLessThan(0.9);
    });

    it('should reduce confidence for very short code', () => {
      const confidence = (service as any).calculateConfidence('x', []);

      expect(confidence).toBeLessThan(0.9);
    });
  });

  describe('buildSystemPrompt', () => {
    it('should include source and target languages', () => {
      const prompt = (service as any).buildSystemPrompt('FORTRAN', 'Python');

      expect(prompt).toContain('FORTRAN');
      expect(prompt).toContain('Python');
      expect(prompt).toContain('code archaeologist');
    });

    it('should specify JSON response format', () => {
      const prompt = (service as any).buildSystemPrompt('COBOL', 'JavaScript');

      expect(prompt).toContain('JSON');
      expect(prompt).toContain('translatedCode');
      expect(prompt).toContain('bugs');
    });
  });

  describe('buildUserPrompt', () => {
    it('should include source code and languages', () => {
      const sourceCode = 'PRINT "Hello"';
      const prompt = (service as any).buildUserPrompt(sourceCode, 'BASIC', 'Python');

      expect(prompt).toContain(sourceCode);
      expect(prompt).toContain('BASIC');
      expect(prompt).toContain('Python');
    });
  });
});
