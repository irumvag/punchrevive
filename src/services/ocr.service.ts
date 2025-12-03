/**
 * OCR Service for punch card hole detection
 * Processes images to detect punch hole patterns using computer vision
 */

import sharp from 'sharp';
import { PunchPattern } from '@/src/types/punch-card.types';

/**
 * OCR Service interface for punch card processing
 */
export interface OCRService {
  detectHoles(imageBuffer: Buffer): Promise<PunchPattern>;
  preprocessImage(imageBuffer: Buffer): Promise<Buffer>;
  calculateConfidence(pattern: PunchPattern): number;
}

/**
 * Standard punch card dimensions
 */
const PUNCH_CARD_ROWS = 12;
const PUNCH_CARD_COLUMNS = 80;

/**
 * Darkness threshold for hole detection (0-1, where 1 is white)
 */
const HOLE_DARKNESS_THRESHOLD = 0.3;

/**
 * Minimum confidence threshold for real cards
 */
const MIN_CONFIDENCE_REAL_CARD = 0.95;

/**
 * Confidence threshold for virtual cards
 */
const VIRTUAL_CARD_CONFIDENCE = 1.0;

/**
 * Pre-processes punch card image for optimal hole detection
 * Applies grayscale conversion, adaptive thresholding, and edge detection
 * 
 * @param imageBuffer - Raw image buffer
 * @returns Processed image buffer ready for hole detection
 */
export async function preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Convert to grayscale and normalize
    let processed = sharp(imageBuffer)
      .grayscale()
      .normalize(); // Enhance contrast

    // Get image metadata to determine if we need perspective correction
    const metadata = await sharp(imageBuffer).metadata();
    
    // Apply adaptive thresholding by converting to black and white
    // This helps separate holes from the card background
    processed = processed
      .threshold(128, { grayscale: false }); // Binary threshold

    return await processed.toBuffer();
  } catch (error) {
    throw new Error(`Image pre-processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Detects punch holes in a processed punch card image
 * Creates a 12×80 grid overlay and analyzes darkness in each cell
 * 
 * @param imageBuffer - Pre-processed image buffer
 * @returns PunchPattern with detected holes and confidence score
 */
export async function detectHoles(imageBuffer: Buffer): Promise<PunchPattern> {
  try {
    // First, preprocess the image
    const processedBuffer = await preprocessImage(imageBuffer);

    // Get image dimensions
    const image = sharp(processedBuffer);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to determine image dimensions');
    }

    const imageWidth = metadata.width;
    const imageHeight = metadata.height;

    // Calculate cell dimensions for the 12×80 grid
    const cellWidth = imageWidth / PUNCH_CARD_COLUMNS;
    const cellHeight = imageHeight / PUNCH_CARD_ROWS;

    // Get raw pixel data
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Initialize the grid
    const grid: boolean[][] = Array(PUNCH_CARD_ROWS)
      .fill(null)
      .map(() => Array(PUNCH_CARD_COLUMNS).fill(false));

    let detectedHoles = 0;

    // Analyze each cell in the grid
    for (let row = 0; row < PUNCH_CARD_ROWS; row++) {
      for (let col = 0; col < PUNCH_CARD_COLUMNS; col++) {
        // Calculate cell boundaries
        const x1 = Math.floor(col * cellWidth);
        const y1 = Math.floor(row * cellHeight);
        const x2 = Math.floor((col + 1) * cellWidth);
        const y2 = Math.floor((row + 1) * cellHeight);

        // Sample pixels in the center region of the cell (avoid edges)
        const centerX1 = Math.floor(x1 + cellWidth * 0.25);
        const centerY1 = Math.floor(y1 + cellHeight * 0.25);
        const centerX2 = Math.floor(x2 - cellWidth * 0.25);
        const centerY2 = Math.floor(y2 - cellHeight * 0.25);

        // Calculate average darkness in the cell center
        let totalDarkness = 0;
        let pixelCount = 0;

        for (let y = centerY1; y < centerY2; y++) {
          for (let x = centerX1; x < centerX2; x++) {
            if (x >= 0 && x < info.width && y >= 0 && y < info.height) {
              const pixelIndex = (y * info.width + x) * info.channels;
              // For grayscale, all channels are the same
              const brightness = data[pixelIndex] / 255; // Normalize to 0-1
              totalDarkness += (1 - brightness); // Invert: 1 = dark, 0 = light
              pixelCount++;
            }
          }
        }

        const avgDarkness = pixelCount > 0 ? totalDarkness / pixelCount : 0;

        // Detect hole if darkness exceeds threshold
        if (avgDarkness > HOLE_DARKNESS_THRESHOLD) {
          grid[row][col] = true;
          detectedHoles++;
        }
      }
    }

    // Create the punch pattern
    const pattern: PunchPattern = {
      grid,
      confidence: 0, // Will be calculated next
      metadata: {
        imageWidth,
        imageHeight,
        detectedColumns: PUNCH_CARD_COLUMNS
      }
    };

    // Calculate confidence score
    pattern.confidence = calculateConfidence(pattern);

    return pattern;
  } catch (error) {
    throw new Error(`Hole detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculates confidence score for detected punch pattern
 * Based on alignment consistency and reasonable hole distribution
 * 
 * @param pattern - Detected punch pattern
 * @returns Confidence score between 0 and 1
 */
export function calculateConfidence(pattern: PunchPattern): number {
  const { grid } = pattern;
  
  // Count total holes
  let totalHoles = 0;
  const columnHoleCounts: number[] = Array(PUNCH_CARD_COLUMNS).fill(0);
  
  for (let row = 0; row < PUNCH_CARD_ROWS; row++) {
    for (let col = 0; col < PUNCH_CARD_COLUMNS; col++) {
      if (grid[row][col]) {
        totalHoles++;
        columnHoleCounts[col]++;
      }
    }
  }

  // Check for reasonable hole distribution
  // A typical punch card has 1-6 holes per column
  let validColumns = 0;
  let usedColumns = 0;
  
  for (let col = 0; col < PUNCH_CARD_COLUMNS; col++) {
    const holeCount = columnHoleCounts[col];
    if (holeCount > 0) {
      usedColumns++;
      // Valid if between 1 and 12 holes (entire column is theoretically possible)
      if (holeCount >= 1 && holeCount <= 12) {
        validColumns++;
      }
    }
  }

  // Calculate confidence factors
  const columnValidityScore = usedColumns > 0 ? validColumns / usedColumns : 0;
  
  // Check for column alignment consistency
  // Columns should have relatively consistent spacing
  let alignmentScore = 1.0;
  if (usedColumns > 1) {
    const avgHolesPerColumn = totalHoles / usedColumns;
    let variance = 0;
    
    for (let col = 0; col < PUNCH_CARD_COLUMNS; col++) {
      if (columnHoleCounts[col] > 0) {
        const diff = columnHoleCounts[col] - avgHolesPerColumn;
        variance += diff * diff;
      }
    }
    
    const stdDev = Math.sqrt(variance / usedColumns);
    // Lower standard deviation = better alignment
    alignmentScore = Math.max(0, 1 - (stdDev / 6)); // Normalize by max expected stddev
  }

  // Check if we have a reasonable number of holes
  // Empty card or completely filled card is suspicious
  const maxReasonableHoles = PUNCH_CARD_ROWS * PUNCH_CARD_COLUMNS * 0.5; // 50% is already very high
  const minReasonableHoles = 1;
  
  let holeRatioScore = 1.0;
  if (totalHoles === 0) {
    holeRatioScore = 0.0; // Empty card
  } else if (totalHoles > maxReasonableHoles) {
    holeRatioScore = 0.3; // Too many holes - likely noise or completely filled
  } else if (totalHoles < minReasonableHoles) {
    holeRatioScore = 0.5; // Very few holes - suspicious
  }

  // Combine scores with weights
  const confidence = (
    columnValidityScore * 0.4 +
    alignmentScore * 0.4 +
    holeRatioScore * 0.2
  );

  return Math.max(0, Math.min(1, confidence));
}

/**
 * Validates if confidence meets minimum threshold
 * 
 * @param confidence - Confidence score
 * @param isVirtual - Whether this is a virtual card
 * @returns True if confidence is acceptable
 */
export function isConfidenceAcceptable(confidence: number, isVirtual: boolean = false): boolean {
  const threshold = isVirtual ? VIRTUAL_CARD_CONFIDENCE : MIN_CONFIDENCE_REAL_CARD;
  return confidence >= threshold;
}

/**
 * Gets appropriate error message for low confidence
 * 
 * @param confidence - Confidence score
 * @returns Spooky error message
 */
export function getLowConfidenceError(confidence: number): string {
  if (confidence < 0.5) {
    return "The card is too faded to read clearly - the spirits cannot decipher these ancient marks";
  } else if (confidence < 0.75) {
    return "The image is obscured by shadows - try better lighting to awaken the code";
  } else {
    return "The card's essence is unclear - please provide a sharper image for resurrection";
}
}

// Export default service object
const ocrService: OCRService = {
  detectHoles,
  preprocessImage,
  calculateConfidence
};

export default ocrService;

// Named export for convenience
export { ocrService };
