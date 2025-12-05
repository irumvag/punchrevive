---
inclusion: always
---

# PunchRevive Local Mode (No AI Required)

## Overview
PunchRevive now works **without any AI API keys** using local EBCDIC translation!

## How It Works

### Virtual Puncher (No API Needed)
1. User punches holes in 80×12 grid
2. Pattern sent to `/api/resurrect-local`
3. EBCDIC decoder translates punch pattern → readable text
4. Results displayed immediately

### Translation Formula
- **Row 0 (12-punch) + Rows 3-11 (1-9)** = Letters A-I
- **Row 1 (11-punch) + Rows 3-11 (1-9)** = Letters J-R  
- **Row 2 (0-punch) + Rows 4-11 (2-9)** = Letters S-Z
- **Rows 2-11 (0-9)** = Digits 0-9
- **Special combinations** = Punctuation & symbols

### Example: "HELLO"
```
H = 12-punch + 8-punch (row 0 + row 8)
E = 12-punch + 5-punch (row 0 + row 5)
L = 11-punch + 3-punch (row 1 + row 3)
L = 11-punch + 3-punch (row 1 + row 3)
O = 11-punch + 6-punch (row 1 + row 6)
```

## Services

### LocalTranslationService
- **Location**: `src/services/local-translation.service.ts`
- **Purpose**: Translate punch patterns without AI
- **Method**: `translatePattern(pattern: PunchPattern)`
- **Returns**: Decoded text + simple report

### EBCDICService  
- **Location**: `src/services/ebcdic.service.ts`
- **Purpose**: IBM 029/026 punch card decoding
- **Maps**: `IBM029_MAP`, `IBM026_MAP`
- **Method**: `decode(pattern, encoding)`

## API Routes

### POST /api/resurrect-local
- **Input**: `{ pattern: boolean[][] }` (12×80 grid)
- **Output**: `{ jobId, translatedCode, exorcismReport, confidence }`
- **No API keys required!**

### GET /api/results/[jobId]
- **Input**: Job ID from resurrection
- **Output**: Full results with decoded text
- **Storage**: In-memory (use Redis/KV in production)

## User Flow

1. **Load Page** → Virtual Puncher shows "HELLO WORLD!" demo
2. **Punch Holes** → Click cells to add/remove punches
3. **Click "RESURRECT CODE"** → Sends pattern to local API
4. **View Results** → Decoded text displayed instantly

## Benefits

✅ **No API costs** - Everything runs locally  
✅ **Instant results** - No AI latency  
✅ **Privacy** - No data sent to external services  
✅ **Educational** - Shows how punch cards actually work  
✅ **Demo-ready** - Works out of the box

## Limitations

❌ No bug detection (requires AI)  
❌ No code modernization (requires AI)  
❌ No language translation (requires AI)  
❌ Only EBCDIC decoding (no OCR for photos)

## Future: Add AI (Optional)

To enable AI features, add to `.env.local`:
```bash
OPENAI_API_KEY=sk-...
# or
CLAUDE_API_KEY=sk-ant-...
# or
OLLAMA_BASE_URL=http://localhost:11434
```

Then use `/api/translate` instead of `/api/resurrect-local`.

## Code Standards

- Use `localTranslationService` for virtual cards
- Use `translationService` only when AI keys available
- Always validate 12×80 grid dimensions
- Check for empty patterns before processing
- Store results with unique job IDs
