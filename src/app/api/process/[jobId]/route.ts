import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { ocrService } from '@/src/services/ocr.service';
import { ebcdicService } from '@/src/services/ebcdic.service';
import { translationService } from '@/src/services/translation.service';
import type { ResurrectionResult } from '@/src/types/api.types';

interface ProcessStatusResponse {
  status: 'processing' | 'complete' | 'error';
  progress: number;
  result?: ResurrectionResult;
  error?: string;
  message?: string;
}

// In-memory job status cache (in production, use Redis/KV)
const jobCache = new Map<string, ProcessStatusResponse>();

/**
 * GET /api/process/[jobId]
 * Poll processing status and retrieve results
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
): Promise<NextResponse<ProcessStatusResponse>> {
  try {
    const { jobId } = params;

    // Check if job exists in cache
    if (jobCache.has(jobId)) {
      return NextResponse.json(jobCache.get(jobId)!);
    }

    // Check if uploaded file exists
    const uploadDir = join(tmpdir(), 'punchrevive-uploads');
    let imageBuffer: Buffer | undefined;
    let imageFormat: string = 'png';

    try {
      // Try different image formats
      for (const ext of ['png', 'jpeg', 'webp', 'jpg']) {
        try {
          const filePath = join(uploadDir, `${jobId}.${ext}`);
          imageBuffer = await readFile(filePath);
          imageFormat = ext;
          break;
        } catch {
          continue;
        }
      }

      if (!imageBuffer) {
        throw new Error('File not found');
      }
    } catch {
      return NextResponse.json(
        {
          status: 'error',
          progress: 0,
          error: 'JOB_NOT_FOUND',
          message: 'This resurrection has faded into the void (expired or invalid ID)'
        },
        { status: 404 }
      );
    }

    // Start processing
    jobCache.set(jobId, {
      status: 'processing',
      progress: 10,
      message: '🔍 Detecting punch holes...'
    });

    try {
      // Step 1: OCR - Detect punch holes
      const punchPattern = await ocrService.detectHoles(imageBuffer);
      
      if (punchPattern.confidence < 0.95) {
        jobCache.set(jobId, {
          status: 'error',
          progress: 30,
          error: 'LOW_CONFIDENCE',
          message: 'The card is too faded to read clearly - try better lighting'
        });
        return NextResponse.json(jobCache.get(jobId)!);
      }

      jobCache.set(jobId, {
        status: 'processing',
        progress: 40,
        message: '📜 Decoding ancient patterns...'
      });

      // Step 2: EBCDIC Decoding
      const encoding = ebcdicService.autoDetectEncoding(punchPattern);
      const decoded = ebcdicService.decode(punchPattern, encoding);

      if (!decoded.sourceCode || decoded.sourceCode.trim().length === 0) {
        jobCache.set(jobId, {
          status: 'error',
          progress: 50,
          error: 'EMPTY_CARD',
          message: 'This card contains no punches - nothing to resurrect'
        });
        return NextResponse.json(jobCache.get(jobId)!);
      }

      jobCache.set(jobId, {
        status: 'processing',
        progress: 70,
        message: '✨ Translating to modern tongue...'
      });

      // Step 3: AI Translation (default to Python)
      const translation = await translationService.translate(
        decoded.sourceCode,
        decoded.language,
        'Python'
      );

      // Complete
      const result: ResurrectionResult = {
        id: jobId,
        punchCardImage: `data:image/${imageFormat};base64,${imageBuffer.toString('base64')}`,
        originalCode: decoded.sourceCode,
        originalLanguage: decoded.language,
        translatedCode: translation.translatedCode,
        targetLanguage: 'Python',
        bugs: translation.bugs,
        timestamp: new Date()
      };

      jobCache.set(jobId, {
        status: 'complete',
        progress: 100,
        result,
        message: '⚡ Resurrection complete!'
      });

      return NextResponse.json(jobCache.get(jobId)!);

    } catch (processingError) {
      console.error('Processing error:', processingError);
      
      jobCache.set(jobId, {
        status: 'error',
        progress: 0,
        error: 'PROCESSING_FAILED',
        message: 'The resurrection ritual is taking too long - please try again'
      });

      return NextResponse.json(jobCache.get(jobId)!, { status: 500 });
    }

  } catch (error) {
    console.error('Process status error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        progress: 0,
        error: 'INTERNAL_ERROR',
        message: 'The spirits are restless - connection lost'
      },
      { status: 500 }
    );
  }
}
