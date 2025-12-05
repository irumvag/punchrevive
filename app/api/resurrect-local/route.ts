import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { localTranslationService } from '@/src/services/local-translation.service';
import type { PunchPattern } from '@/src/types/punch-card.types';

interface ResurrectRequest {
  pattern: boolean[][];
}

interface ResurrectResponse {
  success: boolean;
  jobId?: string;
  translatedCode?: string;
  exorcismReport?: string;
  confidence?: number;
  message?: string;
  error?: string;
}

/**
 * POST /api/resurrect-local
 * Resurrect punch card pattern using local EBCDIC decoder (no AI required)
 */
export async function POST(request: NextRequest): Promise<NextResponse<ResurrectResponse>> {
  try {
    const body: ResurrectRequest = await request.json();
    const { pattern } = body;

    // Validate pattern
    if (!pattern || !Array.isArray(pattern)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid punch pattern provided',
          error: 'INVALID_PATTERN'
        },
        { status: 400 }
      );
    }

    // Validate pattern dimensions (12 rows × 80 columns)
    if (pattern.length !== 12 || !pattern.every((row: any) => Array.isArray(row) && row.length === 80)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Punch pattern must be 12 rows × 80 columns',
          error: 'INVALID_DIMENSIONS'
        },
        { status: 400 }
      );
    }

    // Check if pattern is empty
    const hasAnyPunches = pattern.some(row => row.some(cell => cell === true));
    if (!hasAnyPunches) {
      return NextResponse.json(
        {
          success: false,
          message: 'The punch card is blank - punch some holes first!',
          error: 'EMPTY_PATTERN'
        },
        { status: 400 }
      );
    }

    // Create punch pattern object
    const punchPattern: PunchPattern = {
      grid: pattern,
      confidence: 1.0, // Virtual cards have perfect confidence
      metadata: {
        imageWidth: 80,
        imageHeight: 12,
        detectedColumns: 80,
      }
    };

    // Translate using local service (no AI needed!)
    const result = await localTranslationService.translatePattern(punchPattern);

    // Generate unique job ID for results page
    const jobId = randomUUID();

    // Store result in memory (in production, use Redis/KV)
    // For now, we'll return it directly
    (global as any).resurrectionResults = (global as any).resurrectionResults || {};
    (global as any).resurrectionResults[jobId] = {
      translatedCode: result.translatedCode,
      exorcismReport: result.exorcismReport,
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        jobId,
        translatedCode: result.translatedCode,
        exorcismReport: result.exorcismReport,
        confidence: result.confidence,
        message: '⚡ Code resurrected successfully!'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Local resurrection error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'The resurrection ritual failed - please try again',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
