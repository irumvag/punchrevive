/**
 * Local Translation Service (No AI Required)
 * Translates punch card patterns directly to readable text using EBCDIC decoding
 * Perfect for demo mode without API keys
 */

import type { PunchPattern, TranslationResult, BugFix } from '../types/punch-card.types';
import { ebcdicService } from './ebcdic.service';

/**
 * Simple local translator - no AI needed!
 */
export class LocalTranslationService {
  /**
   * Translate punch pattern to readable text (no AI required)
   */
  async translatePattern(pattern: PunchPattern): Promise<TranslationResult> {
    // Decode the punch pattern using EBCDIC
    const decoded = ebcdicService.decode(pattern, 'IBM029');
    
    // Format the decoded text nicely
    const formattedCode = this.formatCode(decoded.sourceCode);
    
    // Generate a simple report
    const exorcismReport = this.generateSimpleReport(decoded.sourceCode, decoded.language);
    
    return {
      translatedCode: formattedCode,
      bugs: [], // No bug detection without AI
      exorcismReport,
      confidence: decoded.confidence,
    };
  }

  /**
   * Format decoded text into readable code
   */
  private formatCode(rawText: string): string {
    // Remove excessive whitespace
    const formatted = rawText.trim();
    
    // Split into lines (punch cards are typically 80 chars wide)
    const lines: string[] = [];
    for (let i = 0; i < formatted.length; i += 80) {
      const line = formatted.substring(i, i + 80).trimEnd();
      if (line.length > 0) {
        lines.push(line);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Generate a simple report without AI analysis
   */
  private generateSimpleReport(sourceCode: string, language: string): string {
    const lines = [
      '🧛 RESURRECTION REPORT 🧛',
      '',
      `✨ Ancient code successfully decoded from punch card!`,
      '',
      `📜 Detected Language: ${language}`,
      `📏 Code Length: ${sourceCode.length} characters`,
      `📊 Lines: ${sourceCode.split('\n').length}`,
      '',
      '⚡ The code has been resurrected and is ready to view!',
      '',
      '💡 Note: This is a direct EBCDIC translation.',
      '   For AI-powered bug fixing and modernization,',
      '   add an API key to your .env.local file.',
    ];
    
    return lines.join('\n');
  }
}

export const localTranslationService = new LocalTranslationService();
export default LocalTranslationService;
