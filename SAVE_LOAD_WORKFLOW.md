# 💾 Save & Load Punch Cards - Complete Workflow

## Quick Start Guide

### Step 1: Create and Save a Punch Card

1. Open the app
2. Click **💾 Line-Based** card
3. Click a demo button (e.g., "FIBONACCI PYTHON")
4. Click **"Encode to Punch Cards"**
5. See 7 visual punch cards with holes
6. Click **💾 Save** on any card (e.g., Card #1)
7. Toast: "Card #1 saved!"

### Step 2: Load the Card in Virtual Puncher

1. Click **⌨️ Virtual Puncher** card
2. See new dropdown: **💾 Load Saved Card**
3. Select your saved card from the list
4. The 8×80 punch pattern loads into the grid
5. See: "Currently loaded: Line 1: def fibonacci(n):"

### Step 3: Decode the Card

1. New button appears: **🔍 Decode Text**
2. Click it
3. **📜 Decoded Text** panel appears
4. Shows the original text: `def fibonacci(n):`

## What You'll See

### In Line-Based Mode
```
┌─────────────────────────────────────────────┐
│ Card #1                  8 rows × 80 columns│
│                                    💾 Save   │
├─────────────────────────────────────────────┤
│ def fibonacci(n):                           │
│                                             │
│ [8×80 grid with green glowing holes]       │
│                                             │
│ 245 holes punched                           │
└─────────────────────────────────────────────┘
```

### In Virtual Puncher (After Loading)
```
┌─────────────────────────────────────────────┐
│ 💾 Load Saved Card: [Line 1: def fib...  ▼]│
│ Currently loaded: Line 1: def fibonacci(n): │
└─────────────────────────────────────────────┘

[12×80 Grid - First 8 rows have punch pattern]
[Rows 9-12 are empty]

Buttons: [💀 Clear] [🧛 Reload Demo] [🔍 Decode Text] [⚡ RESURRECT ⚡]

┌─────────────────────────────────────────────┐
│           📜 Decoded Text                   │
├─────────────────────────────────────────────┤
│ def fibonacci(n):                           │
└─────────────────────────────────────────────┘
```

## Technical Flow

### Save Process
```
Line-Based Mode
    ↓
User encodes code
    ↓
Each card gets 💾 Save button
    ↓
User clicks save
    ↓
Convert bits → 8×80 grid
    ↓
POST /api/cards
    ↓
Save to Supabase
    ↓
Toast confirmation
```

### Load Process
```
Virtual Puncher
    ↓
Fetch saved cards on mount
    ↓
Display in dropdown
    ↓
User selects card
    ↓
Load 8×80 grid
    ↓
Pad to 12×80 (add 4 empty rows)
    ↓
Display in grid
```

### Decode Process
```
User clicks "Decode Text"
    ↓
Extract first 8 rows
    ↓
Convert 640 cells → 640 bits
    ↓
Group into 80 bytes (8 bits each)
    ↓
Convert each byte → ASCII character
    ↓
Display text
```

## Data Format

### Saved Card Object
```json
{
  "id": "uuid",
  "name": "Line 1: def fibonacci(n):",
  "grid_data": [
    [true, false, true, ...],  // Row 1 (80 booleans)
    [false, true, false, ...], // Row 2
    ...                         // Rows 3-8
  ],
  "rows": 8,
  "cols": 80,
  "original_text": "def fibonacci(n):",
  "card_type": "line-based",
  "created_at": "2025-12-05T..."
}
```

### Grid Conversion
```
8×80 saved grid:
  Row 1: [80 booleans]
  Row 2: [80 booleans]
  ...
  Row 8: [80 booleans]

→ Loads as 12×80 in Virtual Puncher:
  Row 1-8: [saved data]
  Row 9-12: [false, false, ...] (empty)
```

## Use Cases

### 1. Educational
- Save example code snippets
- Load and decode to see how encoding works
- Compare different encoding patterns

### 2. Archival
- Preserve punch card designs
- Build a collection of interesting patterns
- Share historical code representations

### 3. Debugging
- Save problematic cards
- Load and inspect bit patterns
- Decode to verify correctness

### 4. Creative
- Create ASCII art punch cards
- Save and share designs
- Build punch card galleries

## Features Summary

| Feature | Description |
|---------|-------------|
| **Save** | Store punch cards to database |
| **Load** | Retrieve saved cards into grid |
| **Decode** | Extract text from punch pattern |
| **Public** | All cards visible to everyone |
| **Persistent** | Cards saved permanently in Supabase |
| **Visual** | See actual punch holes, not just bits |
| **Reverse** | Go from holes → text (opposite of encoding) |

## Benefits

✅ **Persistent**: Cards don't disappear when you refresh
✅ **Shareable**: Everyone can see and load saved cards
✅ **Educational**: See how bits map to text
✅ **Reversible**: Encode → Save → Load → Decode
✅ **Visual**: Beautiful green glowing holes
✅ **Fast**: Instant save and load
✅ **Simple**: 3-step workflow

---

Now you can save punch cards from Line-Based mode, load them in Virtual Puncher, and decode them to see the original text - completing the full cycle from code → holes → code! 🔄💾⚡
