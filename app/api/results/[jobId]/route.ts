import { NextRequest, NextResponse } from 'next/server';

interface ResultResponse {
  success: boolean;
  status: 'complete' | 'processing' | 'error';
  result?: {
    translatedCode: string;
    exorcismReport: string;
    confidence: number;
    originalCode: string;
    originalLanguage: string;
    targetLanguage: string;
    timestamp: string;
  };
  error?: string;
  message?: string;
}

/**
 * GET /api/results/[jobId]
 * Fetch resurrection results by job ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
): Promise<NextResponse<ResultResponse>> {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          status: 'error',
          message: 'Job ID is required',
          error: 'MISSING_JOB_ID'
        },
        { status: 400 }
      );
    }

    // Check in-memory storage (in production, use Redis/KV)
    const results = (global as any).resurrectionResults || {};
    const result = results[jobId];

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          status: 'error',
          message: 'Resurrection result not found - it may have expired',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: 'complete',
        progress: 100,
        result: {
          translatedCode: result.translatedCode,
          exorcismReport: result.exorcismReport,
          confidence: result.confidence,
          originalCode: result.translatedCode, // For local, original = translated
          originalLanguage: 'EBCDIC',
          targetLanguage: 'Text',
          bugs: [], // No bugs in local mode
          timestamp: result.timestamp,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Results fetch error:', error);
    
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        message: 'Failed to fetch resurrection results',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
