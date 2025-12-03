/**
 * Core data models for punch card processing and resurrection
 */

/**
 * Represents a punch card with its pattern and metadata
 */
export interface PunchCard {
  id: string;
  source: 'upload' | 'camera' | 'virtual';
  imageUrl?: string;
  pattern: boolean[][]; // 12×80 grid
  confidence: number;
  createdAt: Date;
}

/**
 * Represents the decoded source code from a punch card
 */
export interface DecodedSource {
  cardId: string;
  sourceCode: string;
  language: LegacyLanguage;
  encoding: 'IBM029' | 'IBM026';
  confidence: number;
  decodedAt: Date;
}

/**
 * Legacy programming languages supported by the system
 */
export type LegacyLanguage = 'FORTRAN' | 'COBOL' | 'ASSEMBLER' | 'BASIC' | 'UNKNOWN';

/**
 * Modern target languages for translation
 */
export type ModernLanguage = 'Python' | 'JavaScript';

/**
 * Represents a translated code result
 */
export interface Translation {
  sourceId: string;
  translatedCode: string;
  targetLanguage: ModernLanguage;
  bugs: BugFix[];
  confidence: number;
  translatedAt: Date;
}

/**
 * Types of bugs that can be detected and fixed
 */
export type BugType = 
  | 'infinite_loop' 
  | 'memory_leak' 
  | 'syntax_error' 
  | 'undefined_variable' 
  | 'type_mismatch';

/**
 * Severity levels for bugs
 */
export type BugSeverity = 'critical' | 'warning' | 'info';

/**
 * Represents a bug fix applied during translation
 */
export interface BugFix {
  id: string;
  type: BugType;
  severity: BugSeverity;
  location: {
    line: number;
    column: number;
    snippet: string;
  };
  description: string;
  spookyMessage: string;
  fix: string;
}

/**
 * Complete shareable result containing all resurrection data
 */
export interface ShareableResult {
  id: string;
  punchCard: PunchCard;
  decodedSource: DecodedSource;
  translation: Translation;
  certificateUrl: string;
  shareUrl: string;
  views: number;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Punch pattern representation from OCR
 */
export interface PunchPattern {
  grid: boolean[][]; // 12 rows × 80 columns
  confidence: number; // 0-1
  metadata: {
    imageWidth: number;
    imageHeight: number;
    detectedColumns: number;
  };
}

/**
 * Decoded card result from EBCDIC decoder
 */
export interface DecodedCard {
  sourceCode: string;
  language: LegacyLanguage;
  encoding: 'IBM029' | 'IBM026';
  confidence: number;
}

/**
 * Translation result from AI service
 */
export interface TranslationResult {
  translatedCode: string;
  bugs: BugFix[];
  exorcismReport: string;
  confidence: number;
}

/**
 * Complete resurrection result for internal processing
 */
export interface ResurrectionResult {
  id: string;
  punchCardImage: string; // Base64 or URL
  originalCode: string;
  originalLanguage: LegacyLanguage;
  translatedCode: string;
  targetLanguage: ModernLanguage;
  bugs: BugFix[];
  timestamp: Date;
}
