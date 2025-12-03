/**
 * Component prop types for UI components
 */

import type { 
  BugFix, 
  LegacyLanguage, 
  ModernLanguage 
} from './punch-card.types';

/**
 * HauntedLayout component props
 */
export interface HauntedLayoutProps {
  children: React.ReactNode;
  showCobwebs?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
}

/**
 * UploadZone component props
 */
export interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  acceptedFormats: string[];
  maxSizeMB: number;
}

/**
 * VirtualPuncher component props
 */
export interface VirtualPuncherProps {
  onSubmit: (punchPattern: boolean[][]) => void;
  initialPattern?: boolean[][];
}

/**
 * VirtualPuncher component state
 */
export interface VirtualPuncherState {
  grid: boolean[][]; // 12 rows × 80 columns
  selectedColumn: number | null;
  easterEggTriggered: boolean;
}

/**
 * ResurrectionAnimation component props
 */
export interface ResurrectionAnimationProps {
  punchCardImage: string;
  translatedCode: string;
  onComplete: () => void;
}

/**
 * CodeDisplay component props
 */
export interface CodeDisplayProps {
  originalCode: string;
  originalLanguage: LegacyLanguage;
  translatedCode: string;
  targetLanguage: ModernLanguage;
  exorcismReport: BugFix[];
}

/**
 * ExorcismReport component props
 */
export interface ExorcismReportProps {
  fixes: BugFix[];
}

/**
 * CertificateGenerator component props
 */
export interface CertificateGeneratorProps {
  originalLanguage: string;
  targetLanguage: string;
  resurrectionDate: Date;
  cardId: string;
}

/**
 * ShareButton component props
 */
export interface ShareButtonProps {
  resultId: string;
  punchCardPreview: string;
  codeSnippet: string;
}
