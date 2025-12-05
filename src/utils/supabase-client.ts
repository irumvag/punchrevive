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
  const { data: result, error } = await supabase
    .from('punch_cards')
    .insert([data])
    .select()
    .maybeSingle();

  if (error) throw error;
  return result;
}

export async function loadPunchCards(cardType?: 'line-based' | 'virtual') {
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
}

export async function getPunchCard(id: string) {
  const { data, error } = await supabase
    .from('punch_cards')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as PunchCard | null;
}

export async function deletePunchCard(id: string) {
  const { error } = await supabase
    .from('punch_cards')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
