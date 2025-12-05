/**
 * Line-Based Punch Card Encoding Service
 *
 * Modern approach: Each punch card column stores an entire line of code
 * as a binary sequence, preserving indentation and formatting.
 *
 * Format:
 * - Max 80 characters per line
 * - Each character = 8 bits (ASCII)
 * - Total per line = 640 bits
 * - Multiple lines = multiple columns/cards
 */

export interface LineBasedCard {
  column: number;
  bits: string;
  preview?: string;
}

export interface LineBasedDeck {
  cards: LineBasedCard[];
  metadata?: {
    language?: string;
    filename?: string;
    totalLines?: number;
  };
}

export interface DecodedSource {
  sourceCode: string;
  lines: string[];
  totalLines: number;
  language?: string;
}

/**
 * Line-Based Encoding Service
 * Encodes/decodes entire lines of code as binary sequences
 */
export class LineBasedEncodingService {
  private readonly MAX_LINE_LENGTH = 80;
  private readonly BITS_PER_CHAR = 8;

  /**
   * Encode a single line of code to binary string
   */
  encodeLine(line: string): string {
    // Truncate if too long
    const truncatedLine = line.slice(0, this.MAX_LINE_LENGTH);

    // Pad to full length with spaces
    const paddedLine = truncatedLine.padEnd(this.MAX_LINE_LENGTH, ' ');

    // Convert each character to 8-bit binary
    const bits = Array.from(paddedLine)
      .map(char => {
        const charCode = char.charCodeAt(0);
        return charCode.toString(2).padStart(this.BITS_PER_CHAR, '0');
      })
      .join('');

    return bits;
  }

  /**
   * Decode a binary string back to a line of code
   */
  decodeLine(bits: string): string {
    if (bits.length !== this.MAX_LINE_LENGTH * this.BITS_PER_CHAR) {
      throw new Error(`Invalid bit length: expected ${this.MAX_LINE_LENGTH * this.BITS_PER_CHAR}, got ${bits.length}`);
    }

    const chars: string[] = [];

    // Process 8 bits at a time
    for (let i = 0; i < bits.length; i += this.BITS_PER_CHAR) {
      const chunk = bits.slice(i, i + this.BITS_PER_CHAR);
      const charCode = parseInt(chunk, 2);
      chars.push(String.fromCharCode(charCode));
    }

    // Join and trim trailing spaces
    return chars.join('').trimEnd();
  }

  /**
   * Encode multiple lines into a deck of cards
   */
  encodeSource(sourceCode: string, metadata?: { language?: string; filename?: string }): LineBasedDeck {
    const lines = sourceCode.split('\n');

    const cards: LineBasedCard[] = lines.map((line, index) => ({
      column: index + 1,
      bits: this.encodeLine(line),
      preview: line.slice(0, 40) + (line.length > 40 ? '...' : '')
    }));

    return {
      cards,
      metadata: {
        ...metadata,
        totalLines: lines.length
      }
    };
  }

  /**
   * Decode a deck of cards back to source code
   */
  decodeSource(deck: LineBasedDeck): DecodedSource {
    // Sort cards by column number to maintain order
    const sortedCards = [...deck.cards].sort((a, b) => a.column - b.column);

    const lines = sortedCards.map(card => this.decodeLine(card.bits));
    const sourceCode = lines.join('\n');

    return {
      sourceCode,
      lines,
      totalLines: lines.length,
      language: deck.metadata?.language
    };
  }

  /**
   * Convert a deck to visual grid representation (for UI display)
   * Returns a 2D array where each row is a card and columns are bit segments
   */
  deckToVisualGrid(deck: LineBasedDeck, bitsPerSegment: number = 8): boolean[][][] {
    return deck.cards.map(card => {
      const segments: boolean[][] = [];

      for (let i = 0; i < card.bits.length; i += bitsPerSegment) {
        const segment = card.bits.slice(i, i + bitsPerSegment);
        segments.push(segment.split('').map(bit => bit === '1'));
      }

      return segments;
    });
  }

  /**
   * Detect language from source code
   */
  detectLanguage(sourceCode: string): string {
    const upperCode = sourceCode.toUpperCase();

    // Simple heuristics
    if (upperCode.includes('DEF ') || upperCode.includes('IMPORT ') || upperCode.includes('PRINT(')) {
      return 'Python';
    }
    if (upperCode.includes('FUNCTION ') || upperCode.includes('CONST ') || upperCode.includes('LET ')) {
      return 'JavaScript';
    }
    if (upperCode.includes('PUBLIC CLASS') || upperCode.includes('SYSTEM.OUT')) {
      return 'Java';
    }
    if (upperCode.includes('PROGRAM') || upperCode.includes('SUBROUTINE')) {
      return 'FORTRAN';
    }
    if (upperCode.includes('PROCEDURE') || upperCode.includes('BEGIN')) {
      return 'Pascal';
    }

    return 'Unknown';
  }

  /**
   * Validate bit string format
   */
  validateBitString(bits: string): boolean {
    // Must be all 0s and 1s
    if (!/^[01]+$/.test(bits)) {
      return false;
    }

    // Must be correct length
    if (bits.length !== this.MAX_LINE_LENGTH * this.BITS_PER_CHAR) {
      return false;
    }

    return true;
  }

  /**
   * Get statistics about a deck
   */
  getDeckStats(deck: LineBasedDeck): {
    totalCards: number;
    totalBits: number;
    totalBytes: number;
    totalCharacters: number;
    averageLineLength: number;
  } {
    const totalCards = deck.cards.length;
    const totalBits = totalCards * this.MAX_LINE_LENGTH * this.BITS_PER_CHAR;
    const totalBytes = totalBits / 8;

    // Decode to get actual character counts
    const decoded = this.decodeSource(deck);
    const totalCharacters = decoded.lines.reduce((sum, line) => sum + line.length, 0);
    const averageLineLength = totalCharacters / totalCards;

    return {
      totalCards,
      totalBits,
      totalBytes,
      totalCharacters,
      averageLineLength: Math.round(averageLineLength * 10) / 10
    };
  }
}

/**
 * Singleton instance
 */
export const lineBasedEncodingService = new LineBasedEncodingService();

/**
 * Demo patterns for line-based encoding
 */
export const LINE_BASED_DEMOS = {
  HELLO_WORLD_PYTHON: `print("Hello, World!")
print("Resurrected from punch cards!")
print("Each line is a binary sequence")`,

  FIBONACCI_PYTHON: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))`,

  FACTORIAL_JS: `function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5));`,

  BUBBLE_SORT: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,

  CLASSIC_FORTRAN: `      PROGRAM HELLO
      PRINT *, 'HELLO WORLD'
      PRINT *, 'FROM PUNCHCARDS'
      END PROGRAM`,
};
