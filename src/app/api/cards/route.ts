import { NextRequest, NextResponse } from 'next/server';
import { savePunchCard, loadPunchCards } from '@/src/utils/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, grid_data, rows, cols, original_text, card_type } = body;

    if (!name || !grid_data || !rows || !cols || !card_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await savePunchCard({
      name,
      grid_data,
      rows,
      cols,
      original_text: original_text || null,
      card_type,
    });

    return NextResponse.json({ success: true, card: result });
  } catch (error) {
    console.error('Error saving punch card:', error);
    return NextResponse.json(
      { error: 'Failed to save punch card' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardType = searchParams.get('type') as 'line-based' | 'virtual' | null;

    const cards = await loadPunchCards(cardType || undefined);
    return NextResponse.json({ success: true, cards });
  } catch (error) {
    console.error('Error loading punch cards:', error);
    return NextResponse.json(
      { error: 'Failed to load punch cards' },
      { status: 500 }
    );
  }
}
