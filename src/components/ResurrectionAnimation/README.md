# ResurrectionAnimation Component

Multi-stage animation component that shows code coming back to life with haunted laboratory effects.

## Features

- **Lightning Strike** (0-1s): Animated lightning bolts striking the punch card with flash effects
- **Card Shaking** (1-2s): Punch card shakes as spirits awaken
- **Ectoplasm Glow** (2-3s): Green ectoplasm radiates from the card with floating particles
- **Code Materialization** (3-4s): Translated code appears character-by-character
- **Ghost Moan Sound**: Subtle audio effect throughout the sequence
- **Skip Button**: Allows impatient users to skip the animation

## Usage

```tsx
import ResurrectionAnimation from '@/components/ResurrectionAnimation';

<ResurrectionAnimation
  punchCardImage="/path/to/card.png"
  translatedCode="print('Hello, World!')"
  onComplete={() => console.log('Animation complete!')}
/>
```

## Props

- `punchCardImage` (string): URL or base64 of the punch card image
- `translatedCode` (string): The resurrected code to display
- `onComplete` (function): Callback fired when animation completes

## Animation Stages

1. **Lightning** - Dramatic lightning strikes with flash overlay
2. **Shake** - Card vibrates as energy flows through it
3. **Ectoplasm** - Ghostly green glow expands with particles
4. **Materialize** - Code types out character by character
5. **Complete** - Success message displayed

## Accessibility

- Respects `prefers-reduced-motion` (skip button available)
- Keyboard accessible skip button
- Screen reader friendly stage announcements

## Styling

Uses haunted laboratory aesthetic:
- Pure black background (#000000)
- Toxic green effects (#0f0)
- IBM Plex Mono for code
- Creepster font for stage messages
- CRT scanline overlay
