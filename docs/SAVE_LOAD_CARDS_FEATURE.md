# 💾 Save & Load Punch Cards Feature

## Overview

You can now save punch cards created in Line-Based mode and load them in Virtual Puncher to decode and see what text they represent!

## How It Works

### 1. Save Cards (Line-Based Mode)

1. Go to **💾 Line-Based** tab
2. Load a demo or enter your own code
3. Click **"Encode to Punch Cards"**
4. Each card now has a **💾 Save** button in the header
5. Click save on any card you want to keep
6. Toast notification confirms: "Card #X saved!"

### 2. Load Cards (Virtual Puncher)

1. Go to **⌨️ Virtual Puncher** tab
2. Look for the **💾 Load Saved Card** dropdown (appears if you have saved cards)
3. Select a card from the dropdown
4. The card's punch pattern loads into the grid
5. "Currently loaded: [card name]" displays below

### 3. Decode Cards

1. After loading a saved card, a new button appears: **🔍 Decode Text**
2. Click it to decode the punch card
3. A **📜 Decoded Text** panel appears showing the original text
4. The text is extracted from the 8×80 bit pattern

## Technical Details

### Database Schema

**Table**: `punch_cards`
- `id` (uuid) - Unique identifier
- `name` (text) - Card name (e.g., "Line 1: print('Hello')")
- `grid_data` (jsonb) - 2D boolean array of the punch pattern
- `rows` (integer) - Number of rows (8 for line-based)
- `cols` (integer) - Number of columns (80)
- `original_text` (text) - Source text
- `card_type` (text) - 'line-based' or 'virtual'
- `created_at` (timestamptz) - Timestamp
- `user_session` (text, nullable) - Session identifier

### Encoding Format

Line-based cards use **8 rows × 80 columns = 640 bits**:
- Each character = 8 bits (ASCII)
- Up to 80 characters per line
- Bits map directly to holes: '1' = punched, '0' = empty

### API Endpoints

**Save Card**
```
POST /api/cards
Body: {
  name: string,
  grid_data: boolean[][],
  rows: number,
  cols: number,
  original_text: string,
  card_type: 'line-based' | 'virtual'
}
```

**Load Cards**
```
GET /api/cards?type=line-based
Response: { cards: PunchCard[] }
```

**Get Single Card**
```
GET /api/cards/[id]
Response: { card: PunchCard }
```

### Decoding Algorithm

```typescript
// Extract bits from first 8 rows
const bits: string[] = [];
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 80; col++) {
    bits.push(grid[row][col] ? '1' : '0');
  }
}

// Convert every 8 bits to a character
const chars: string[] = [];
for (let i = 0; i < bits.length; i += 8) {
  const byte = bits.slice(i, i + 8).join('');
  const charCode = parseInt(byte, 2);
  if (charCode > 0) {
    chars.push(String.fromCharCode(charCode));
  }
}

const decoded = chars.join('').replace(/\0+$/, '');
```

## User Flow Example

### Scenario: Save "Hello World" Code

1. **Line-Based Mode**
   - Load "FIBONACCI PYTHON" demo
   - Click "Encode to Punch Cards"
   - See 7 cards (one per line)
   - Click 💾 Save on Card #1: "def fibonacci(n):"
   - Success toast appears

2. **Virtual Puncher**
   - Switch to Virtual Puncher tab
   - See new dropdown: "💾 Load Saved Card"
   - Select "Line 1: def fibonacci(n):"
   - Grid loads with punch pattern (8 rows filled, rows 9-12 empty)
   - Text shows: "Currently loaded: Line 1: def fibonacci(n):"

3. **Decode**
   - Click **🔍 Decode Text**
   - Decoded text panel appears below
   - Shows: `def fibonacci(n):`
   - Matches the original line perfectly!

## UI Components

### Save Button (LineBasedPuncher)
- Location: Card header, right side
- States:
  - Default: "💾 Save"
  - Saving: "💾..."
  - Disabled while saving

### Load Dropdown (VirtualPuncher)
- Location: Between demo selector and controls
- Shows: Card name from database
- Format: "Line X: [preview text]"
- Auto-refreshes on component mount

### Decode Button (VirtualPuncher)
- Location: Control buttons row
- Appears: Only when a card is loaded
- Style: Green background with glow
- Action: Decodes 8×80 grid to text

### Decoded Text Display
- Appears: After clicking decode
- Style: Green monospace text with glow
- Format: Pre-formatted (preserves whitespace)
- Animation: Fade in from bottom

## Security

### Row Level Security (RLS)

**SELECT Policy**: Anyone can view all cards (public gallery)
```sql
CREATE POLICY "Anyone can view punch cards"
  ON punch_cards FOR SELECT
  TO anon, authenticated
  USING (true);
```

**INSERT Policy**: Anyone can create cards (anonymous creation)
```sql
CREATE POLICY "Anyone can create punch cards"
  ON punch_cards FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

**DELETE Policy**: Users can delete their own cards
```sql
CREATE POLICY "Users can delete their own cards"
  ON punch_cards FOR DELETE
  TO anon, authenticated
  USING (user_session = current_setting('request.jwt.claims', true)::json->>'sub' OR user_session IS NULL);
```

## Features

✅ **Save individual cards** from line-based encoding
✅ **Load saved cards** into Virtual Puncher
✅ **Decode punch patterns** back to text
✅ **Visual feedback** with toasts and loading states
✅ **Persistent storage** in Supabase database
✅ **Public card gallery** (all cards visible to everyone)
✅ **Automatic grid conversion** (8×80 → 12×80 with padding)

## Future Enhancements

Possible improvements:
- Edit card names
- Add descriptions/tags
- Private cards (user authentication)
- Search/filter saved cards
- Export cards as images
- Share card URLs
- Card collections/decks
- Vote/favorite system
- Card history/versions

## Build Impact

- **Database**: New table created automatically
- **Package**: `@supabase/supabase-js` added (9 packages)
- **Size increase**: +0.9 kB on main page (29.8 kB)
- **New routes**: `/api/cards`, `/api/cards/[id]`
- **Performance**: No noticeable impact

---

The save/load feature transforms punch cards from ephemeral creations into persistent artifacts that can be shared, loaded, and decoded - bridging the gap between encoding and decoding! 💾⚡📜
