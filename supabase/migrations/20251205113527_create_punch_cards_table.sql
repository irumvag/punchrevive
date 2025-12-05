/*
  # Punch Cards Storage

  1. New Tables
    - `punch_cards`
      - `id` (uuid, primary key) - Unique card identifier
      - `name` (text) - User-friendly card name
      - `grid_data` (jsonb) - 2D boolean array representing the punch card
      - `rows` (integer) - Number of rows (8 for line-based, 12 for virtual)
      - `cols` (integer) - Number of columns (80)
      - `original_text` (text, nullable) - Source text if from line-based encoding
      - `card_type` (text) - Type: 'line-based' or 'virtual'
      - `created_at` (timestamptz) - Creation timestamp
      - `user_session` (text, nullable) - Optional session identifier for anonymous users
  
  2. Security
    - Enable RLS on `punch_cards` table
    - Allow anyone to read all cards (public gallery)
    - Allow anyone to insert cards (anonymous creation)
    - Users can delete their own cards based on session
  
  3. Indexes
    - Index on created_at for sorting
    - Index on card_type for filtering
*/

CREATE TABLE IF NOT EXISTS punch_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grid_data jsonb NOT NULL,
  rows integer NOT NULL DEFAULT 12,
  cols integer NOT NULL DEFAULT 80,
  original_text text,
  card_type text NOT NULL DEFAULT 'virtual',
  created_at timestamptz DEFAULT now(),
  user_session text
);

ALTER TABLE punch_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view punch cards"
  ON punch_cards
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create punch cards"
  ON punch_cards
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete their own cards"
  ON punch_cards
  FOR DELETE
  TO anon, authenticated
  USING (user_session = current_setting('request.jwt.claims', true)::json->>'sub' OR user_session IS NULL);

CREATE INDEX IF NOT EXISTS idx_punch_cards_created_at ON punch_cards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_punch_cards_type ON punch_cards(card_type);
