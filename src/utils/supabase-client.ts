import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient];
  }
});

// In-memory fallback for local development when Supabase is unreachable
let inMemoryCards: PunchCard[] = [];

export interface PunchCard {
  id: string;
  name: string;
  grid_data: boolean[][];
  rows: number;
  cols: number;
  original_text: string | null;
  card_type: 'line-based' | 'virtual';
  created_at: string;
  user_session?: string;
}

export async function savePunchCard(data: Omit<PunchCard, 'id' | 'created_at'>) {
  try {
    const { data: result, error } = await supabase
      .from('punch_cards')
      .insert([data])
      .select()
      .maybeSingle();

    if (error) throw error;
    return result;
  } catch (err) {
    // Fallback: store in-memory for local development when Supabase is unreachable
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const created_at = new Date().toISOString();
    const record: PunchCard = { id, created_at, ...data } as PunchCard;
    inMemoryCards.unshift(record);
    return record as any;
  }
}

export async function loadPunchCards(cardType?: 'line-based' | 'virtual') {
  try {
    let query = supabase
      .from('punch_cards')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (cardType) {
      query = query.eq('card_type', cardType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as PunchCard[];
  } catch (err) {
    // Fallback: return in-memory cards
    let results = inMemoryCards.slice();
    if (cardType) results = results.filter((c) => c.card_type === cardType);
    return results;
  }
}

export async function getPunchCard(id: string) {
  try {
    const { data, error } = await supabase
      .from('punch_cards')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as PunchCard | null;
  } catch (err) {
    const found = inMemoryCards.find((c) => c.id === id) || null;
    return found;
  }
}

export async function deletePunchCard(id: string) {
  try {
    const { error } = await supabase
      .from('punch_cards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    inMemoryCards = inMemoryCards.filter((c) => c.id !== id);
  }
}
