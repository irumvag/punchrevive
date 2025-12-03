/**
 * Unit tests for Storage Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ResurrectionResult } from '../types';

// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    set: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock crypto for UUID generation
vi.mock('crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('crypto')>();
  return {
    ...actual,
    randomUUID: vi.fn(() => 'test-uuid-12345'),
  };
});

import { saveResult, getResult, generateShareableLink } from './storage.service';
import { kv } from '@vercel/kv';
import { randomUUID } from 'crypto';

describe('StorageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(randomUUID).mockReturnValue('test-uuid-12345');
  });

  describe('saveResult', () => {
    it('should save result with generated UUID and return the ID', async () => {
      const mockResult: Omit<ResurrectionResult, 'id'> = {
        punchCardImage: 'data:image/png;base64,abc123',
        originalCode: 'PROGRAM HELLO',
        originalLanguage: 'FORTRAN',
        translatedCode: 'print("hello")',
        targetLanguage: 'Python',
        bugs: [],
        timestamp: new Date('2024-01-01'),
      };

      vi.mocked(kv.set).mockResolvedValue('OK');

      const id = await saveResult(mockResult);

      // Verify ID is a valid UUID format
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      // Verify kv.set was called with correct parameters
      expect(kv.set).toHaveBeenCalledWith(
        `resurrection:${id}`,
        expect.objectContaining({
          ...mockResult,
          id,
        }),
        { ex: 30 * 24 * 60 * 60 } // 30 days in seconds
      );
    });

    it('should throw error if KV save fails', async () => {
      const mockResult: Omit<ResurrectionResult, 'id'> = {
        punchCardImage: 'data:image/png;base64,abc123',
        originalCode: 'PROGRAM HELLO',
        originalLanguage: 'FORTRAN',
        translatedCode: 'print("hello")',
        targetLanguage: 'Python',
        bugs: [],
        timestamp: new Date('2024-01-01'),
      };

      vi.mocked(kv.set).mockRejectedValue(new Error('KV error'));

      await expect(saveResult(mockResult)).rejects.toThrow(
        'Failed to preserve the resurrection for sharing'
      );
    });

    it('should include all result fields when saving', async () => {
      const mockResult: Omit<ResurrectionResult, 'id'> = {
        punchCardImage: 'data:image/png;base64,xyz789',
        originalCode: '10 PRINT "TEST"',
        originalLanguage: 'BASIC',
        translatedCode: 'console.log("TEST")',
        targetLanguage: 'JavaScript',
        bugs: [
          {
            id: 'bug-1',
            type: 'syntax_error',
            severity: 'critical',
            location: { line: 1, column: 5, snippet: 'PRINT' },
            description: 'Invalid syntax',
            spookyMessage: 'Syntax demon banished',
            fix: 'Fixed syntax',
          },
        ],
        timestamp: new Date('2024-01-15'),
      };

      vi.mocked(kv.set).mockResolvedValue('OK');

      const id = await saveResult(mockResult);

      expect(kv.set).toHaveBeenCalledWith(
        `resurrection:${id}`,
        expect.objectContaining({
          punchCardImage: mockResult.punchCardImage,
          originalCode: mockResult.originalCode,
          originalLanguage: mockResult.originalLanguage,
          translatedCode: mockResult.translatedCode,
          targetLanguage: mockResult.targetLanguage,
          bugs: mockResult.bugs,
          timestamp: mockResult.timestamp,
          id: expect.any(String),
        }),
        expect.any(Object)
      );
    });
  });

  describe('getResult', () => {
    it('should retrieve result by ID', async () => {
      const mockResult: ResurrectionResult = {
        id: 'test-uuid-12345',
        punchCardImage: 'data:image/png;base64,abc123',
        originalCode: 'PROGRAM HELLO',
        originalLanguage: 'FORTRAN',
        translatedCode: 'print("hello")',
        targetLanguage: 'Python',
        bugs: [],
        timestamp: new Date('2024-01-01'),
      };

      vi.mocked(kv.get).mockResolvedValue(mockResult);

      const result = await getResult('test-uuid-12345');

      expect(result).toEqual(mockResult);
      expect(kv.get).toHaveBeenCalledWith('resurrection:test-uuid-12345');
    });

    it('should return null if result not found', async () => {
      vi.mocked(kv.get).mockResolvedValue(null);

      const result = await getResult('nonexistent-id');

      expect(result).toBeNull();
    });

    it('should convert timestamp string to Date object', async () => {
      const mockResult = {
        id: 'test-uuid-12345',
        punchCardImage: 'data:image/png;base64,abc123',
        originalCode: 'PROGRAM HELLO',
        originalLanguage: 'FORTRAN',
        translatedCode: 'print("hello")',
        targetLanguage: 'Python',
        bugs: [],
        timestamp: '2024-01-01T00:00:00.000Z', // String from KV
      };

      vi.mocked(kv.get).mockResolvedValue(mockResult as any);

      const result = await getResult('test-uuid-12345');

      expect(result?.timestamp).toBeInstanceOf(Date);
      expect(result?.timestamp.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should return null if KV get fails', async () => {
      vi.mocked(kv.get).mockRejectedValue(new Error('KV error'));

      const result = await getResult('test-uuid-12345');

      expect(result).toBeNull();
    });
  });

  describe('generateShareableLink', () => {
    it('should generate shareable URL with ID', () => {
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      process.env.NEXT_PUBLIC_APP_URL = 'https://punchrevive.com';

      const url = generateShareableLink('test-uuid-12345');

      expect(url).toBe('https://punchrevive.com/share/test-uuid-12345');

      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });

    it('should use localhost as default if NEXT_PUBLIC_APP_URL not set', () => {
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;

      const url = generateShareableLink('test-uuid-12345');

      expect(url).toBe('http://localhost:3000/share/test-uuid-12345');

      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });

    it('should handle different ID formats', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://punchrevive.com';

      const url1 = generateShareableLink('abc-123-def');
      const url2 = generateShareableLink('550e8400-e29b-41d4-a716-446655440000');

      expect(url1).toBe('https://punchrevive.com/share/abc-123-def');
      expect(url2).toBe('https://punchrevive.com/share/550e8400-e29b-41d4-a716-446655440000');
    });
  });
});
