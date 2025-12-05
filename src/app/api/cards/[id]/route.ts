import { NextRequest, NextResponse } from 'next/server';
import { getPunchCard, deletePunchCard } from '@/src/utils/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await getPunchCard(id);

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, card });
  } catch (error) {
    console.error('Error loading punch card:', error);
    return NextResponse.json(
      { error: 'Failed to load punch card' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePunchCard(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting punch card:', error);
    return NextResponse.json(
      { error: 'Failed to delete punch card' },
      { status: 500 }
    );
  }
}
