/**
 * API request and response types for all endpoints
 */

import type { 
  ResurrectionResult, 
  BugFix, 
  LegacyLanguage, 
  ModernLanguage 
} from './punch-card.types';

// Re-export types for convenience
export type { ResurrectionResult, BugFix, LegacyLanguage, ModernLanguage };

/**
 * Upload API request body
 */
export interface UploadRequest {
  image: File | string; // File object or base64
  source: 'upload' | 'camera' | 'virtual';
}

/**
 * Upload API response
 */
export interface UploadResponse {
  success: boolean;
  jobId: string;
  message: string;
}

/**
 * Processing status values
 */
export type ProcessingStatus = 'processing' | 'complete' | 'error';

/**
 * Process status API response
 */
export interface ProcessStatusResponse {
  status: ProcessingStatus;
  progress: number; // 0-100
  result?: ResurrectionResult;
  error?: string;
}

/**
 * Translation API request body
 */
export interface TranslationRequest {
  sourceCode: string;
  sourceLang: LegacyLanguage;
  targetLang: ModernLanguage;
}

/**
 * Translation API response
 */
export interface TranslationResponse {
  translatedCode: string;
  bugs: BugFix[];
  exorcismReport: string;
}

/**
 * Share API response
 */
export interface ShareResponse {
  result: ResurrectionResult;
  metadata: {
    views: number;
    createdAt: Date;
  };
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  message: string;
}

/**
 * Success response wrapper
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Generic API response type
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
