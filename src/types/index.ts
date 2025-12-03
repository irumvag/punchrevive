/**
 * Central export for all type definitions
 */

// Punch card types
export type {
  PunchCard,
  DecodedSource,
  Translation,
  BugFix,
  ShareableResult,
  PunchPattern,
  DecodedCard,
  TranslationResult,
  ResurrectionResult,
  LegacyLanguage,
  ModernLanguage,
  BugType,
  BugSeverity,
} from './punch-card.types';

// API types
export type {
  UploadRequest,
  UploadResponse,
  ProcessStatusResponse,
  TranslationRequest,
  TranslationResponse,
  ShareResponse,
  ErrorResponse,
  SuccessResponse,
  ApiResponse,
  ProcessingStatus,
} from './api.types';

// UI types
export type {
  HauntedLayoutProps,
  UploadZoneProps,
  VirtualPuncherProps,
  VirtualPuncherState,
  ResurrectionAnimationProps,
  CodeDisplayProps,
  ExorcismReportProps,
  CertificateGeneratorProps,
  ShareButtonProps,
} from './ui.types';
