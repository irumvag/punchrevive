/**
 * Bug detection patterns and utilities
 * These patterns help validate and categorize bugs detected by the AI
 */

import type { BugType } from '../types/punch-card.types';

/**
 * Bug detection patterns for common issues
 */
export const BUG_PATTERNS = {
  /**
   * Infinite loop patterns
   */
  infinite_loop: [
    /while\s*\(\s*true\s*\)/i, // while(true) without break
    /while\s*\(\s*1\s*\)/i, // while(1) without break
    /for\s*\(\s*;\s*;\s*\)/i, // for(;;) without break
    /loop\s+do/i, // FORTRAN LOOP DO without exit
  ],

  /**
   * Memory leak patterns
   */
  memory_leak: [
    /open\s*\([^)]+\)(?!.*close)/i, // File opened but not closed
    /malloc\s*\([^)]+\)(?!.*free)/i, // Memory allocated but not freed
    /new\s+\w+(?!.*delete)/i, // Object created but not deleted
  ],

  /**
   * Syntax error patterns
   */
  syntax_error: [
    /\w+\s*\(/i, // Function call without closing paren (partial check)
    /\{[^}]*$/m, // Opening brace without closing
    /\[[^\]]*$/m, // Opening bracket without closing
  ],

  /**
   * Undefined variable patterns
   */
  undefined_variable: [
    /\b([a-z_]\w*)\s*(?:=|:=)/i, // Variable assignment (needs context check)
  ],

  /**
   * Type mismatch patterns
   */
  type_mismatch: [
    /"[^"]*"\s*[+\-*/]\s*\d+/i, // String + number operation
    /\d+\s*[+\-*/]\s*"[^"]*"/i, // Number + string operation
  ],
};

/**
 * Validate if a bug type is legitimate based on code snippet
 */
export function validateBugType(
  bugType: BugType,
  codeSnippet: string
): boolean {
  const patterns = BUG_PATTERNS[bugType];
  if (!patterns) return false;

  // Check if any pattern matches the code snippet
  return patterns.some((pattern) => pattern.test(codeSnippet));
}

/**
 * Suggest bug type based on code snippet
 */
export function suggestBugType(codeSnippet: string): BugType | null {
  for (const [bugType, patterns] of Object.entries(BUG_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(codeSnippet))) {
      return bugType as BugType;
    }
  }
  return null;
}

/**
 * Common bug keywords for each type
 */
export const BUG_KEYWORDS: Record<BugType, string[]> = {
  infinite_loop: ['loop', 'while', 'for', 'iteration', 'endless', 'termination'],
  memory_leak: ['memory', 'leak', 'allocation', 'free', 'close', 'resource'],
  syntax_error: ['syntax', 'parse', 'invalid', 'unexpected', 'token'],
  undefined_variable: ['undefined', 'undeclared', 'not defined', 'unknown variable'],
  type_mismatch: ['type', 'mismatch', 'incompatible', 'conversion', 'cast'],
};

/**
 * Check if a description matches a bug type
 */
export function matchesBugType(
  bugType: BugType,
  description: string
): boolean {
  const keywords = BUG_KEYWORDS[bugType];
  const lowerDesc = description.toLowerCase();
  return keywords.some((keyword) => lowerDesc.includes(keyword));
}

/**
 * Severity levels for different bug types
 */
export const DEFAULT_BUG_SEVERITY: Record<BugType, 'critical' | 'warning' | 'info'> = {
  infinite_loop: 'critical',
  memory_leak: 'critical',
  syntax_error: 'critical',
  undefined_variable: 'warning',
  type_mismatch: 'warning',
};

/**
 * Spooky messages for each bug type
 */
export const SPOOKY_BUG_MESSAGES: Record<BugType, string[]> = {
  infinite_loop: [
    'Infinite loop demon banished',
    'Eternal cycle curse broken',
    'Endless iteration specter exorcised',
  ],
  memory_leak: [
    'Memory leak vampire staked',
    'Resource drain phantom vanquished',
    'Allocation ghost purified',
  ],
  syntax_error: [
    'Syntax error ghost exorcised',
    'Malformed code wraith dispelled',
    'Parse error poltergeist banished',
  ],
  undefined_variable: [
    'Undefined variable specter vanquished',
    'Undeclared entity ghost captured',
    'Phantom variable exorcised',
  ],
  type_mismatch: [
    'Type mismatch zombie neutralized',
    'Incompatible type demon slain',
    'Type confusion curse lifted',
  ],
};

/**
 * Get a random spooky message for a bug type
 */
export function getSpookyMessage(bugType: BugType): string {
  const messages = SPOOKY_BUG_MESSAGES[bugType];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Validate bug fix description
 */
export function isValidBugFix(fix: string): boolean {
  // A valid fix should be descriptive and not empty
  return fix.trim().length > 10 && /[a-z]/i.test(fix);
}

/**
 * Format bug location for display
 */
export function formatBugLocation(line: number, column: number): string {
  return `Line ${line}, Column ${column}`;
}

/**
 * Extract code context around a bug location
 */
export function extractCodeContext(
  code: string,
  line: number,
  contextLines: number = 2
): string {
  const lines = code.split('\n');
  const startLine = Math.max(0, line - contextLines - 1);
  const endLine = Math.min(lines.length, line + contextLines);
  
  return lines.slice(startLine, endLine).join('\n');
}
