/**
 * Demo punch card patterns for Virtual Puncher
 * Each pattern represents a different message or code snippet
 */

export interface DemoPattern {
  name: string;
  description: string;
  punches: { row: number; col: number }[];
}

/**
 * Demo 1: "HELLO WORLD" - Classic greeting
 */
export const HELLO_WORLD_PATTERN: DemoPattern = {
  name: 'HELLO WORLD',
  description: 'Classic programmer greeting',
  punches: [
    // H (12-8)
    { row: 0, col: 0 }, { row: 8, col: 0 },
    // E (12-5)
    { row: 0, col: 1 }, { row: 5, col: 1 },
    // L (11-3)
    { row: 1, col: 2 }, { row: 3, col: 2 },
    // L (11-3)
    { row: 1, col: 3 }, { row: 3, col: 3 },
    // O (11-6)
    { row: 1, col: 4 }, { row: 6, col: 4 },
    // Space
    // W (0-6)
    { row: 2, col: 6 }, { row: 6, col: 6 },
    // O (11-6)
    { row: 1, col: 7 }, { row: 6, col: 7 },
    // R (11-9)
    { row: 1, col: 8 }, { row: 9, col: 8 },
    // L (11-3)
    { row: 1, col: 9 }, { row: 3, col: 9 },
    // D (12-4)
    { row: 0, col: 10 }, { row: 4, col: 10 },
  ],
};

/**
 * Demo 2: "FORTRAN" - Legacy language name
 */
export const FORTRAN_PATTERN: DemoPattern = {
  name: 'FORTRAN',
  description: 'The ancient language of punch cards',
  punches: [
    // F (12-6)
    { row: 0, col: 0 }, { row: 6, col: 0 },
    // O (11-6)
    { row: 1, col: 1 }, { row: 6, col: 1 },
    // R (11-9)
    { row: 1, col: 2 }, { row: 9, col: 2 },
    // T (0-3)
    { row: 2, col: 3 }, { row: 3, col: 3 },
    // R (11-9)
    { row: 1, col: 4 }, { row: 9, col: 4 },
    // A (12-1)
    { row: 0, col: 5 }, { row: 3, col: 5 },
    // N (11-5)
    { row: 1, col: 6 }, { row: 5, col: 6 },
  ],
};

/**
 * Demo 3: "CODE 1960" - Vintage year
 */
export const CODE_1960_PATTERN: DemoPattern = {
  name: 'CODE 1960',
  description: 'When punch cards ruled the world',
  punches: [
    // C (12-3)
    { row: 0, col: 0 }, { row: 3, col: 0 },
    // O (11-6)
    { row: 1, col: 1 }, { row: 6, col: 1 },
    // D (12-4)
    { row: 0, col: 2 }, { row: 4, col: 2 },
    // E (12-5)
    { row: 0, col: 3 }, { row: 5, col: 3 },
    // Space
    // 1 (1)
    { row: 3, col: 5 },
    // 9 (9)
    { row: 9, col: 6 },
    // 6 (6)
    { row: 6, col: 7 },
    // 0 (0)
    { row: 2, col: 8 },
  ],
};

/**
 * Demo 4: "IBM 029" - Punch card machine model
 */
export const IBM_029_PATTERN: DemoPattern = {
  name: 'IBM 029',
  description: 'The legendary keypunch machine',
  punches: [
    // I (12-9)
    { row: 0, col: 0 }, { row: 9, col: 0 },
    // B (12-2)
    { row: 0, col: 1 }, { row: 4, col: 1 },
    // M (11-4)
    { row: 1, col: 2 }, { row: 4, col: 2 },
    // Space
    // 0 (0)
    { row: 2, col: 4 },
    // 2 (2)
    { row: 4, col: 5 },
    // 9 (9)
    { row: 9, col: 6 },
  ],
};

/**
 * Demo 5: "PUNCH CARD" - Self-referential
 */
export const PUNCH_CARD_PATTERN: DemoPattern = {
  name: 'PUNCH CARD',
  description: 'The medium is the message',
  punches: [
    // P (11-7)
    { row: 1, col: 0 }, { row: 7, col: 0 },
    // U (0-4)
    { row: 2, col: 1 }, { row: 4, col: 1 },
    // N (11-5)
    { row: 1, col: 2 }, { row: 5, col: 2 },
    // C (12-3)
    { row: 0, col: 3 }, { row: 3, col: 3 },
    // H (12-8)
    { row: 0, col: 4 }, { row: 8, col: 4 },
    // Space
    // C (12-3)
    { row: 0, col: 6 }, { row: 3, col: 6 },
    // A (12-1)
    { row: 0, col: 7 }, { row: 3, col: 7 },
    // R (11-9)
    { row: 1, col: 8 }, { row: 9, col: 8 },
    // D (12-4)
    { row: 0, col: 9 }, { row: 4, col: 9 },
  ],
};

/**
 * All demo patterns
 */
export const DEMO_PATTERNS: DemoPattern[] = [
  HELLO_WORLD_PATTERN,
  FORTRAN_PATTERN,
  CODE_1960_PATTERN,
  IBM_029_PATTERN,
  PUNCH_CARD_PATTERN,
];

/**
 * Convert demo pattern to grid format (12×80)
 */
export function patternToGrid(pattern: DemoPattern): boolean[][] {
  const grid = Array.from({ length: 12 }, () => Array(80).fill(false));
  
  pattern.punches.forEach(({ row, col }) => {
    if (row >= 0 && row < 12 && col >= 0 && col < 80) {
      grid[row][col] = true;
    }
  });
  
  return grid;
}

/**
 * Get random demo pattern
 */
export function getRandomDemo(): DemoPattern {
  return DEMO_PATTERNS[Math.floor(Math.random() * DEMO_PATTERNS.length)];
}
