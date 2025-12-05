import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/src/services/storage.service';
import type { ResurrectionResult } from '@/src/types/api.types';

interface ShareResponse {
  success: boolean;
  result?: ResurrectionResult;
  metadata?: {
    views: number;
    createdAt: Date;
  };
  error?: string;
  message?: string;
}

/**
 * GET /api/share/[id]
 * Retrieve shared resurrection result
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ShareResponse>> {
  try {
    const { id } = await params;

    // Validate ID format (basic UUID validation)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'This resurrection has faded into the void (expired or invalid ID)',
          error: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    try {
      // Retrieve result from storage
      const result = await storageService.getResult(id);

      if (!result) {
        return NextResponse.json(
          {
            success: false,
            message: 'This resurrection has faded into the void (expired or invalid ID)',
            error: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }

      // Increment view count
      await storageService.incrementViews(id);

      // Get current view count
      const views = await storageService.getViews(id);

      return NextResponse.json(
        {
          success: true,
          result,
          metadata: {
            views,
            createdAt: result.timestamp
          }
        },
        { status: 200 }
      );

    } catch (storageError) {
      console.error('Storage retrieval error:', storageError);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to retrieve the resurrection from the archives',
          error: 'STORAGE_ERROR'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Share endpoint error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'The spirits are restless - connection lost',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/share/[id]
 * Create a new shareable result (alternative endpoint for creating shares)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ShareResponse>> {
  try {
    const body: ResurrectionResult = await request.json();

    // Validate required fields
    if (!body.originalCode || !body.translatedCode || !body.originalLanguage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields for sharing',
          error: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    try {
      // Save result to storage
      const savedId = await storageService.saveResult(body);

      return NextResponse.json(
        {
          success: true,
          result: { ...body, id: savedId },
          metadata: {
            views: 0,
            createdAt: new Date()
          }
        },
        { status: 201 }
      );

    } catch (storageError) {
      console.error('Storage save error:', storageError);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to preserve the resurrection for sharing',
          error: 'STORAGE_ERROR'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Share creation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'The spirits are restless - connection lost',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
