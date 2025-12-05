import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { lineBasedEncodingService, type LineBasedDeck } from '@/src/services/line-based-encoding.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface LineBasedRequest {
  deck: LineBasedDeck;
}

export async function POST(req: NextRequest) {
  try {
    const body: LineBasedRequest = await req.json();
    const { deck } = body;

    if (!deck || !deck.cards || deck.cards.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid deck data' },
        { status: 400 }
      );
    }

    // Validate all cards
    for (const card of deck.cards) {
      if (!lineBasedEncodingService.validateBitString(card.bits)) {
        return NextResponse.json(
          { success: false, message: `Invalid bit string in card ${card.column}` },
          { status: 400 }
        );
      }
    }

    // Decode the deck
    const decoded = lineBasedEncodingService.decodeSource(deck);

    // Get statistics
    const stats = lineBasedEncodingService.getDeckStats(deck);

    // Generate job ID
    const jobId = `line-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Store result in KV
    const result = {
      jobId,
      sourceCode: decoded.sourceCode,
      language: decoded.language || 'Unknown',
      encoding: 'LINE_BASED',
      confidence: 1.0,
      metadata: {
        totalLines: decoded.totalLines,
        totalCards: stats.totalCards,
        totalBits: stats.totalBits,
        totalBytes: stats.totalBytes,
        averageLineLength: stats.averageLineLength,
        filename: deck.metadata?.filename || 'resurrected-code.txt'
      },
      timestamp: new Date().toISOString(),
      mode: 'line-based'
    };

    // Store in KV with 24 hour expiration
    await kv.set(`job:${jobId}`, JSON.stringify(result), { ex: 86400 });

    return NextResponse.json({
      success: true,
      jobId,
      message: `Successfully decoded ${stats.totalCards} lines of code`
    });

  } catch (error) {
    console.error('Line-based resurrection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to resurrect code'
      },
      { status: 500 }
    );
  }
}
