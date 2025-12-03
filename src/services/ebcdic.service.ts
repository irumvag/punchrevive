/**
 * EBCDIC Decoder Service
 * Translates IBM punch card patterns to source code characters
 * Supports IBM 029 and IBM 026 encoding standards
 */

import type { PunchPattern, DecodedCard, LegacyLanguage } from '@/src/types/punch-card.types';

/**
 * Represents a punch position as a string key (e.g., "12-0", "11-1")
 */
type PunchCode = string;

/**
 * IBM 029 encoding map - maps punch patterns to characters
 * Format: "row1-row2-..." where rows are 12, 11, 0-9
 */
const IBM029_MAP: Record<PunchCode, string> = {
  // Letters A-I (12 punch + 1-9)
  '12-1': 'A',
  '12-2': 'B',
  '12-3': 'C',
  '12-4': 'D',
  '12-5': 'E',
  '12-6': 'F',
  '12-7': 'G',
  '12-8': 'H',
  '12-9': 'I',
  
  // Letters J-R (11 punch + 1-9)
  '11-1': 'J',
  '11-2': 'K',
  '11-3': 'L',
  '11-4': 'M',
  '11-5': 'N',
  '11-6': 'O',
  '11-7': 'P',
  '11-8': 'Q',
  '11-9': 'R',
  
  // Letters S-Z (0 punch + 2-9)
  '0-2': 'S',
  '0-3': 'T',
  '0-4': 'U',
  '0-5': 'V',
  '0-6': 'W',
  '0-7': 'X',
  '0-8': 'Y',
  '0-9': 'Z',
  
  // Digits 0-9
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  
  // Special characters
  '12-0': '&',
  '11-0': '-',
  '0-1': '/',
  '12-11': '#',
  '12-0-1': '?',
  '11-0-1': '!',
  '0-3-8': '.',
  '12-3-8': ',',
  '11-3-8': '$',
  '12-4-8': '*',
  '11-4-8': ']',
  '12-5-8': ';',
  '11-5-8': '\\',
  '12-6-8': '¬',
  '11-6-8': '%',
  '0-4-8': '<',
  '12-7-8': '(',
  '11-7-8': '_',
  '0-5-8': '>',
  '0-6-8': '|',
  '12-8-9': ':',
  '11-8-9': '=',
  '0-8-9': '"',
  '12': '+',
  '11': '=',
  '12-11-0': '@',
  '12-0-9': '[',
  
  // Space
  '': ' ',
};

/**
 * IBM 026 encoding map - older standard with some differences
 */
const IBM026_MAP: Record<PunchCode, string> = {
  // Letters A-I (12 punch + 1-9)
  '12-1': 'A',
  '12-2': 'B',
  '12-3': 'C',
  '12-4': 'D',
  '12-5': 'E',
  '12-6': 'F',
  '12-7': 'G',
  '12-8': 'H',
  '12-9': 'I',
  
  // Letters J-R (11 punch + 1-9)
  '11-1': 'J',
  '11-2': 'K',
  '11-3': 'L',
  '11-4': 'M',
  '11-5': 'N',
  '11-6': 'O',
  '11-7': 'P',
  '11-8': 'Q',
  '11-9': 'R',
  
  // Letters S-Z (0 punch + 2-9)
  '0-2': 'S',
  '0-3': 'T',
  '0-4': 'U',
  '0-5': 'V',
  '0-6': 'W',
  '0-7': 'X',
  '0-8': 'Y',
  '0-9': 'Z',
  
  // Digits 0-9
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  
  // Special characters (differences from IBM 029)
  '12-0': '&',
  '11-0': '-',
  '0-1': '/',
  '12-11': '=',  // Different from 029
  '12-0-1': '?',
  '11-0-1': '!',
  '0-3-8': '.',
  '12-3-8': ',',
  '11-3-8': '$',
  '12-4-8': '*',
  '11-4-8': ']',
  '12-5-8': ';',
  '0-4-8': '<',
  '12-7-8': '(',
  '11-7-8': '@',  // Different from 029
  '0-5-8': '>',
  '12-8-9': ':',
  '11-8-9': '#',  // Different from 029
  '0-8-9': '"',
  '12': '+',
  '11': '=',
  
  // Space
  '': ' ',
};

/**
 * Language detection keywords for each legacy language
 */
const LANGUAGE_KEYWORDS: Record<LegacyLanguage, string[]> = {
  FORTRAN: [
    'PROGRAM', 'SUBROUTINE', 'FUNCTION', 'END', 'DO', 'IF', 'THEN', 'ELSE',
    'FORMAT', 'WRITE', 'READ', 'CALL', 'RETURN', 'CONTINUE', 'GOTO',
    'DIMENSION', 'COMMON', 'EQUIVALENCE', 'DATA', 'IMPLICIT', 'REAL', 'INTEGER'
  ],
  COBOL: [
    'IDENTIFICATION', 'DIVISION', 'PROCEDURE', 'DATA', 'WORKING-STORAGE',
    'PERFORM', 'MOVE', 'TO', 'DISPLAY', 'ACCEPT', 'STOP', 'RUN',
    'PIC', 'PICTURE', 'VALUE', 'COMPUTE', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'
  ],
  ASSEMBLER: [
    'MOV', 'ADD', 'SUB', 'MUL', 'DIV', 'JMP', 'JE', 'JNE', 'CALL', 'RET',
    'PUSH', 'POP', 'CMP', 'TEST', 'AND', 'OR', 'XOR', 'NOT',
    'AX', 'BX', 'CX', 'DX', 'SI', 'DI', 'SP', 'BP'
  ],
  BASIC: [
    'PRINT', 'INPUT', 'LET', 'GOTO', 'GOSUB', 'RETURN', 'IF', 'THEN',
    'FOR', 'NEXT', 'STEP', 'DIM', 'REM', 'END', 'DATA', 'READ'
  ],
  UNKNOWN: []
};

/**
 * EBCDIC Decoder Service
 */
export class EBCDICService {
  /**
   * Decode a punch pattern using specified encoding
   */
  decode(pattern: PunchPattern, encoding: 'IBM029' | 'IBM026' = 'IBM029'): DecodedCard {
    const map = encoding === 'IBM029' ? IBM029_MAP : IBM026_MAP;
    const sourceCode = this.translatePattern(pattern.grid, map);
    const language = this.detectLanguage(sourceCode);
    
    // Calculate confidence based on pattern quality and language detection
    const confidence = this.calculateConfidence(sourceCode, language, pattern.confidence);
    
    return {
      sourceCode,
      language,
      encoding,
      confidence
    };
  }

  /**
   * Auto-detect encoding by trying both and scoring coherence
   */
  autoDetectEncoding(pattern: PunchPattern): 'IBM029' | 'IBM026' {
    const decoded029 = this.decode(pattern, 'IBM029');
    const decoded026 = this.decode(pattern, 'IBM026');
    
    // Score based on:
    // 1. Language detection confidence
    // 2. Ratio of valid characters to total characters
    // 3. Presence of common programming constructs
    
    const score029 = this.scoreCoherence(decoded029.sourceCode, decoded029.language);
    const score026 = this.scoreCoherence(decoded026.sourceCode, decoded026.language);
    
    return score029 >= score026 ? 'IBM029' : 'IBM026';
  }

  /**
   * Detect the programming language from source code
   */
  detectLanguage(sourceCode: string): LegacyLanguage {
    const upperCode = sourceCode.toUpperCase();
    const scores: Record<LegacyLanguage, number> = {
      FORTRAN: 0,
      COBOL: 0,
      ASSEMBLER: 0,
      BASIC: 0,
      UNKNOWN: 0
    };
    
    // Score each language based on keyword matches
    for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
      if (lang === 'UNKNOWN') continue;
      
      for (const keyword of keywords) {
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = upperCode.match(regex);
        if (matches) {
          scores[lang as LegacyLanguage] += matches.length;
        }
      }
    }
    
    // Additional heuristics
    
    // FORTRAN: Column-based structure, line numbers in columns 1-5
    if (/^\s{0,5}\d{1,5}\s+[A-Z]/.test(sourceCode)) {
      scores.FORTRAN += 5;
    }
    
    // COBOL: DIVISION keyword is very distinctive
    if (upperCode.includes('DIVISION')) {
      scores.COBOL += 10;
    }
    
    // BASIC: Line numbers at start
    if (/^\d+\s+[A-Z]/.test(sourceCode)) {
      scores.BASIC += 5;
    }
    
    // ASSEMBLER: Register names and short mnemonics
    if (/\b(AX|BX|CX|DX|SI|DI|SP|BP)\b/.test(upperCode)) {
      scores.ASSEMBLER += 5;
    }
    
    // Find language with highest score
    let maxScore = 0;
    let detectedLang: LegacyLanguage = 'UNKNOWN';
    
    for (const [lang, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedLang = lang as LegacyLanguage;
      }
    }
    
    // Require minimum score to avoid false positives
    return maxScore >= 2 ? detectedLang : 'UNKNOWN';
  }

  /**
   * Translate punch pattern grid to string using encoding map
   */
  private translatePattern(grid: boolean[][], map: Record<PunchCode, string>): string {
    const result: string[] = [];
    
    // Process each column (80 columns)
    for (let col = 0; col < 80; col++) {
      const punchCode = this.extractPunchCode(grid, col);
      const char = map[punchCode];
      
      if (char !== undefined) {
        result.push(char);
      } else {
        // Unknown punch pattern - use placeholder
        result.push('�');
      }
    }
    
    return result.join('').trimEnd();
  }

  /**
   * Extract punch code from a column
   * Returns string like "12-1-5" for punches in rows 12, 1, and 5
   */
  private extractPunchCode(grid: boolean[][], col: number): PunchCode {
    const punches: string[] = [];
    
    // Row mapping: 0=12, 1=11, 2=0, 3=1, 4=2, ..., 11=9
    const rowNames = ['12', '11', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    for (let row = 0; row < 12; row++) {
      if (grid[row] && grid[row][col]) {
        punches.push(rowNames[row]);
      }
    }
    
    return punches.join('-');
  }

  /**
   * Score the coherence of decoded text
   * Higher score = more likely to be correct encoding
   */
  private scoreCoherence(sourceCode: string, language: LegacyLanguage): number {
    let score = 0;
    
    // Language detection adds significant score
    if (language !== 'UNKNOWN') {
      score += 50;
    }
    
    // Ratio of valid ASCII characters (letters, digits, common punctuation)
    const validChars = sourceCode.match(/[A-Za-z0-9\s.,;:()\[\]{}+\-*\/=<>!@#$%&|]/g);
    const validRatio = validChars ? validChars.length / sourceCode.length : 0;
    score += validRatio * 30;
    
    // Presence of unknown characters (�) reduces score
    const unknownCount = (sourceCode.match(/�/g) || []).length;
    score -= unknownCount * 5;
    
    // Reasonable line structure (not too long, has some breaks)
    const lines = sourceCode.split('\n');
    if (lines.length > 1 && lines.every(line => line.length < 200)) {
      score += 10;
    }
    
    // Common programming patterns
    if (/[A-Z][A-Z0-9_]*\s*=/.test(sourceCode)) {
      score += 5; // Variable assignment
    }
    if (/\([^)]*\)/.test(sourceCode)) {
      score += 5; // Function calls or expressions
    }
    
    return score;
  }

  /**
   * Calculate overall confidence for decoded result
   */
  private calculateConfidence(
    sourceCode: string,
    language: LegacyLanguage,
    ocrConfidence: number
  ): number {
    let confidence = ocrConfidence;
    
    // Boost confidence if language detected
    if (language !== 'UNKNOWN') {
      confidence = Math.min(1.0, confidence + 0.1);
    }
    
    // Reduce confidence if many unknown characters
    const unknownCount = (sourceCode.match(/�/g) || []).length;
    const unknownRatio = unknownCount / sourceCode.length;
    confidence *= (1 - unknownRatio);
    
    // Ensure confidence stays in valid range
    return Math.max(0, Math.min(1, confidence));
  }
}

// Export singleton instance
export const ebcdicService = new EBCDICService();
