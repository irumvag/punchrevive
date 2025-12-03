/**
 * AI Translation Service
 * Translates legacy code to modern languages using OpenAI GPT-4o (primary) and Claude 3.5 (fallback)
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type {
  LegacyLanguage,
  ModernLanguage,
  BugFix,
  TranslationResult,
  BugType,
  BugSeverity,
} from '../types/punch-card.types';
import { getSpookyMessage, DEFAULT_BUG_SEVERITY } from '../utils/bug-patterns';

/**
 * LLM response structure
 */
interface LLMTranslationResponse {
  translatedCode: string;
  bugs: Array<{
    type: BugType;
    line: number;
    column: number;
    snippet: string;
    description: string;
    fix: string;
  }>;
}

/**
 * Translation service configuration
 */
interface TranslationServiceConfig {
  openaiApiKey?: string;
  claudeApiKey?: string;
  maxRetries?: number;
  timeout?: number;
}

// Note: Spooky messages and severity mappings are now imported from bug-patterns.ts

/**
 * Translation Service
 * Handles AI-powered code translation and bug fixing
 */
export class TranslationService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private config: Required<TranslationServiceConfig>;

  constructor(config: TranslationServiceConfig = {}) {
    this.config = {
      openaiApiKey: config.openaiApiKey || process.env.OPENAI_API_KEY || '',
      claudeApiKey: config.claudeApiKey || process.env.CLAUDE_API_KEY || '',
      maxRetries: config.maxRetries || 3,
      timeout: config.timeout || 30000,
    };

    // Initialize OpenAI client if API key is available
    if (this.config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.config.openaiApiKey,
      });
    }

    // Initialize Anthropic client if API key is available
    if (this.config.claudeApiKey) {
      this.anthropic = new Anthropic({
        apiKey: this.config.claudeApiKey,
      });
    }
  }

  /**
   * Translate legacy code to modern language
   */
  async translate(
    sourceCode: string,
    sourceLang: LegacyLanguage,
    targetLang: ModernLanguage
  ): Promise<TranslationResult> {
    // Try OpenAI first, then Claude as fallback
    let result: LLMTranslationResponse | null = null;
    let lastError: Error | null = null;

    if (this.openai) {
      try {
        result = await this.translateWithOpenAI(sourceCode, sourceLang, targetLang);
      } catch (error) {
        console.error('OpenAI translation failed:', error);
        lastError = error as Error;
      }
    }

    if (!result && this.anthropic) {
      try {
        result = await this.translateWithClaude(sourceCode, sourceLang, targetLang);
      } catch (error) {
        console.error('Claude translation failed:', error);
        lastError = error as Error;
      }
    }

    if (!result) {
      throw new Error(
        `The AI spirits are unavailable - ${lastError?.message || 'please try again'}`
      );
    }

    // Convert bugs to full BugFix objects with spooky messages
    const bugs: BugFix[] = result.bugs.map((bug, index) => ({
      id: `bug-${Date.now()}-${index}`,
      type: bug.type,
      severity: DEFAULT_BUG_SEVERITY[bug.type],
      location: {
        line: bug.line,
        column: bug.column,
        snippet: bug.snippet,
      },
      description: bug.description,
      spookyMessage: getSpookyMessage(bug.type),
      fix: bug.fix,
    }));

    // Generate Exorcism Report
    const exorcismReport = this.generateExorcismReport(bugs);

    return {
      translatedCode: result.translatedCode,
      bugs,
      exorcismReport,
      confidence: this.calculateConfidence(result.translatedCode, bugs),
    };
  }

  /**
   * Translate using OpenAI GPT-4o
   */
  private async translateWithOpenAI(
    sourceCode: string,
    sourceLang: LegacyLanguage,
    targetLang: ModernLanguage
  ): Promise<LLMTranslationResponse> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const systemPrompt = this.buildSystemPrompt(sourceLang, targetLang);
    const userPrompt = this.buildUserPrompt(sourceCode, sourceLang, targetLang);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent code generation
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    return this.parseResponse(content);
  }

  /**
   * Translate using Claude 3.5 Sonnet
   */
  private async translateWithClaude(
    sourceCode: string,
    sourceLang: LegacyLanguage,
    targetLang: ModernLanguage
  ): Promise<LLMTranslationResponse> {
    if (!this.anthropic) {
      throw new Error('Anthropic client not initialized');
    }

    const systemPrompt = this.buildSystemPrompt(sourceLang, targetLang);
    const userPrompt = this.buildUserPrompt(sourceCode, sourceLang, targetLang);

    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return this.parseResponse(content.text);
  }

  /**
   * Build system prompt for LLM
   */
  private buildSystemPrompt(sourceLang: LegacyLanguage, targetLang: ModernLanguage): string {
    return `You are a code archaeologist specializing in resurrecting dead code from vintage punch cards.
Your task is to translate legacy code to modern languages while preserving original logic.

Rules:
1. Translate ${sourceLang} to ${targetLang}
2. Modernize syntax but preserve algorithm and logic exactly
3. Fix bugs: infinite loops, memory leaks, undefined variables, type errors, syntax errors
4. Add minimal comments explaining archaic constructs
5. Ensure output is syntactically valid and runnable
6. Return ONLY valid JSON with this exact structure:
{
  "translatedCode": "the complete translated code",
  "bugs": [
    {
      "type": "infinite_loop" | "memory_leak" | "syntax_error" | "undefined_variable" | "type_mismatch",
      "line": number,
      "column": number,
      "snippet": "code snippet showing the bug",
      "description": "technical description of the bug",
      "fix": "description of how it was fixed"
    }
  ]
}

If no bugs are found, return an empty bugs array.`;
  }

  /**
   * Build user prompt for LLM
   */
  private buildUserPrompt(
    sourceCode: string,
    sourceLang: LegacyLanguage,
    targetLang: ModernLanguage
  ): string {
    return `Translate this ${sourceLang} code to ${targetLang}:

\`\`\`${sourceLang.toLowerCase()}
${sourceCode}
\`\`\`

Detect and fix all bugs. Return JSON with translatedCode and bugs array.`;
  }

  /**
   * Parse LLM response
   */
  private parseResponse(content: string): LLMTranslationResponse {
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      
      const parsed = JSON.parse(jsonStr);

      // Validate response structure
      if (!parsed.translatedCode || typeof parsed.translatedCode !== 'string') {
        throw new Error('Invalid response: missing translatedCode');
      }

      if (!Array.isArray(parsed.bugs)) {
        throw new Error('Invalid response: bugs must be an array');
      }

      return parsed as LLMTranslationResponse;
    } catch (error) {
      console.error('Failed to parse LLM response:', content);
      throw new Error(`Failed to parse AI response: ${(error as Error).message}`);
    }
  }

  /**
   * Generate Exorcism Report from bugs
   */
  private generateExorcismReport(bugs: BugFix[]): string {
    if (bugs.length === 0) {
      return '✨ No demons detected - code is pure ✨';
    }

    const lines = [
      '🧛 EXORCISM REPORT 🧛',
      '',
      `${bugs.length} curse${bugs.length === 1 ? '' : 's'} banished from the ancient code:`,
      '',
    ];

    bugs.forEach((bug, index) => {
      lines.push(`${index + 1}. ${bug.spookyMessage}`);
      lines.push(`   Location: Line ${bug.location.line}, Column ${bug.location.column}`);
      lines.push(`   ${bug.description}`);
      lines.push(`   Fix: ${bug.fix}`);
      lines.push('');
    });

    lines.push('The code has been purified and is ready for resurrection! ⚡');

    return lines.join('\n');
  }

  /**
   * Calculate confidence score for translation
   */
  private calculateConfidence(translatedCode: string, bugs: BugFix[]): number {
    // Base confidence
    let confidence = 0.9;

    // Reduce confidence for each critical bug found
    const criticalBugs = bugs.filter((b) => b.severity === 'critical').length;
    confidence -= criticalBugs * 0.1;

    // Reduce confidence for very short or very long code (might indicate issues)
    if (translatedCode.length < 10) {
      confidence -= 0.2;
    }

    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Detect bugs in source code (standalone method)
   */
  async detectBugs(sourceCode: string): Promise<BugFix[]> {
    // This is a simplified version - in practice, bugs are detected during translation
    // For now, return empty array as bugs are detected in the translate method
    return [];
  }

  /**
   * Fix bugs in code (standalone method)
   */
  async fixBugs(code: string, bugs: BugFix[]): Promise<string> {
    // This is a simplified version - in practice, bugs are fixed during translation
    // For now, return the code as-is since fixing happens in the translate method
    return code;
  }
}

// Export singleton instance
export const translationService = new TranslationService();

// Export class for testing
export default TranslationService;
