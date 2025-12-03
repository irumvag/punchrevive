# ExorcismReport Component

Displays bugs found and fixed during code translation with spooky horror-themed terminology and animations.

## Features

- **Blood-drip styled list**: Each bug fix is displayed in a card with haunted laboratory aesthetics
- **Ghost effect animations**: Bugs are revealed sequentially with ghost-like fade-in effects
- **Spooky terminology**: Technical bugs are described using horror metaphors (e.g., "Infinite loop demon banished")
- **Severity indicators**: Visual icons and styling based on bug severity (critical, warning, info)
- **Code snippets**: Shows the problematic code that was fixed
- **Pure code message**: Displays celebratory message when no bugs are detected

## Usage

```tsx
import ExorcismReport from '@/components/ExorcismReport';
import type { BugFix } from '@/types/punch-card.types';

const fixes: BugFix[] = [
  {
    id: 'bug-1',
    type: 'infinite_loop',
    severity: 'critical',
    location: {
      line: 42,
      column: 5,
      snippet: 'while(true) { /* no break */ }'
    },
    description: 'Loop has no exit condition',
    spookyMessage: 'Infinite loop demon banished',
    fix: 'Added break condition after 100 iterations'
  }
];

<ExorcismReport fixes={fixes} />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fixes` | `BugFix[]` | Yes | Array of bug fixes to display |

## BugFix Interface

```typescript
interface BugFix {
  id: string;
  type: 'infinite_loop' | 'memory_leak' | 'syntax_error' | 'undefined_variable' | 'type_mismatch';
  severity: 'critical' | 'warning' | 'info';
  location: {
    line: number;
    column: number;
    snippet: string;
  };
  description: string;
  spookyMessage: string;
  fix: string;
}
```

## Styling

The component follows the haunted laboratory aesthetic:
- **Colors**: Black background (#000000), toxic green (#0f0), dark green (#003300)
- **Fonts**: Creepster for headings, IBM Plex Mono for code and text
- **Effects**: CRT scanlines, ghost animations, blood drip decorations
- **Severity colors**: Red glow for critical, orange for warnings, green for info

## Animation Behavior

1. Bugs are revealed sequentially with 300ms delay between each
2. Each bug fades in with a ghost-like reveal animation
3. After all bugs are revealed, a footer message appears
4. Severity icons float with subtle animation
5. Pure code message pulses with green glow

## Responsive Design

- **Desktop**: Full-width cards with all details visible
- **Tablet**: Adjusted padding and font sizes
- **Mobile**: Stacked layout, reduced padding, smaller fonts

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Readable color contrast (green on black)
- Touch-friendly spacing on mobile
