import { NextRequest, NextResponse } from 'next/server';
import { translationService } from '@/src/services/translation.service';
import type { LegacyLanguage } from '@/src/types/punch-card.types';

interface TranslateRequest {
  sourceCode: string;
  sourceLang: LegacyLanguage;
  targetLang: 'Python' | 'JavaScript';
}

interface TranslateResponse {
  success: boolean;
  translatedCode?: string;
  bugs?: Array<{
    type: string;
    location: { line: number; column: number };
    description: string;
    spookyMessage: string;
  }>;
  exorcismReport?: string;
  error?: string;
  message?: string;
}

/**
 * POST /api/translate
 * Translate decoded source code to modern language
 */
export async function POST(request: NextRequest): Promise<NextResponse<TranslateResponse>> {
  try {
    const body: TranslateRequest = await request.json();
    const { sourceCode, sourceLang, targetLang } = body;

    // Validate input
    if (!sourceCode || !sourceLang || !targetLang) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: sourceCode, sourceLang, targetLang',
          error: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    // Validate source language
    const validSourceLangs: LegacyLanguage[] = ['FORTRAN', 'COBOL', 'ASSEMBLER', 'BASIC', 'UNKNOWN'];
    if (!validSourceLangs.includes(sourceLang)) {
      return NextResponse.json(
        {
          success: false,
          message: 'The ancient language is unknown to us',
          error: 'INVALID_SOURCE_LANG'
        },
        { status: 400 }
      );
    }

    // Validate target language
    if (!['Python', 'JavaScript'].includes(targetLang)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Target language must be Python or JavaScript',
          error: 'INVALID_TARGET_LANG'
        },
        { status: 400 }
      );
    }

    // Validate source code is not empty
    if (sourceCode.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'The source code is too corrupted to translate',
          error: 'EMPTY_SOURCE'
        },
        { status: 400 }
      );
    }

    try {
      // Perform translation
      const result = await translationService.translate(
        sourceCode,
        sourceLang,
        targetLang
      );

      // Generate exorcism report
      let exorcismReport: string;
      if (result.bugs.length === 0) {
        exorcismReport = '✨ No demons detected - code is pure';
      } else {
        exorcismReport = result.bugs
          .map((bug: { spookyMessage: string }, index: number) => `${index + 1}. ${bug.spookyMessage}`)
          .join('\n');
      }

      return NextResponse.json(
        {
          success: true,
          translatedCode: result.translatedCode,
          bugs: result.bugs,
          exorcismReport
        },
        { status: 200 }
      );

    } catch (translationError) {
      console.error('Translation error:', translationError);

      // Check if it's an API error
      if (translationError instanceof Error) {
        if (translationError.message.includes('rate limit')) {
          return NextResponse.json(
            {
              success: false,
              message: 'Too many resurrections - the spirits need rest',
              error: 'RATE_LIMIT'
            },
            { status: 429 }
          );
        }

        if (translationError.message.includes('API')) {
          return NextResponse.json(
            {
              success: false,
              message: 'The AI spirits are unavailable - please try again',
              error: 'LLM_API_ERROR'
            },
            { status: 503 }
          );
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: 'The source code is too corrupted to translate',
          error: 'TRANSLATION_FAILED'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Translate endpoint error:', error);
    
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
