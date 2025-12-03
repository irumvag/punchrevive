# VirtualPuncher Component

Interactive 80×12 punch card editor for creating virtual punch cards.

## Features

- ✅ Interactive 80-column × 12-row grid
- ✅ Click/touch to toggle punch holes
- ✅ Visual representation (filled circles for punched, empty for unpunched)
- ✅ Easter egg detection for "666" pattern (red screen flash + audio)
- ✅ Card submission with boolean array export
- ✅ Clear card functionality
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Haunted laboratory aesthetic with toxic green theme

## Usage

```tsx
import VirtualPuncher from '@/components/VirtualPuncher';
import { submitVirtualCard } from '@/utils/api-client';

function MyPage() {
  const handleSubmit = async (pattern: boolean[][]) => {
    try {
      const result = await submitVirtualCard(pattern);
      console.log('Job ID:', result.jobId);
      // Navigate to results page or poll for status
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <VirtualPuncher 
      onSubmit={handleSubmit}
      initialPattern={undefined} // Optional: pre-fill pattern
    />
  );
}
```

## Props

### `onSubmit: (pattern: boolean[][]) => void | Promise<void>`
Callback function called when user clicks "Resurrect Code" button.
Receives the 12×80 boolean array representing the punch pattern.

### `initialPattern?: boolean[][]` (optional)
Pre-fill the grid with an existing pattern.
Must be exactly 12 rows × 80 columns.

## Pattern Format

The punch pattern is a 2D boolean array:
- `pattern[row][column]` where row is 0-11 and column is 0-79
- `true` = hole is punched
- `false` = no hole

Example:
```typescript
const pattern: boolean[][] = [
  [false, false, true, ...], // Row 0 (80 columns)
  [false, true, false, ...], // Row 1
  // ... 10 more rows
];
```

## Easter Egg

The component detects the "666" pattern (three consecutive columns with row 6 punched).
When detected:
- Red screen flash effect
- Spooky audio tone (using Web Audio API)
- Visual indicator message

## Styling

The component uses inline styles with CSS-in-JS for the haunted laboratory theme:
- Background: `#000000` (black)
- Primary: `#0f0` (toxic green)
- Secondary: `#003300` (dark green)
- Font: IBM Plex Mono (code) and Creepster (headings)

## Accessibility

- Semantic HTML with ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Touch-friendly targets (44×44px minimum on mobile)

## API Integration

Use the `submitVirtualCard` utility from `@/utils/api-client`:

```typescript
import { submitVirtualCard, waitForProcessing } from '@/utils/api-client';

const handleSubmit = async (pattern: boolean[][]) => {
  // Submit the pattern
  const { jobId } = await submitVirtualCard(pattern);
  
  // Wait for processing to complete
  const result = await waitForProcessing(jobId, (progress) => {
    console.log(`Processing: ${progress}%`);
  });
  
  if (result.status === 'complete') {
    console.log('Resurrection complete!', result.result);
  }
};
```

## Testing

The component includes comprehensive unit tests:
- Grid rendering
- Toggle behavior
- Clear functionality
- Submission handling
- Initial pattern support
- Loading states

Run tests:
```bash
npm test -- VirtualPuncher.test.tsx
```
