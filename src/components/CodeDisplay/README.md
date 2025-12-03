# CodeDisplay Component

A retro-styled code display component that shows original and translated code side-by-side with syntax highlighting and CRT effects.

## Features

- **Side-by-side comparison**: Original legacy code and modern translated code
- **Syntax highlighting**: Uses Prism.js for Python and JavaScript
- **Retro aesthetics**: IBM Plex Mono font with toxic green (#0f0) color
- **CRT effects**: Scanlines and flicker animation on mount
- **Line numbers**: Retro-styled line numbers for both code panels
- **Bug summary**: Shows count of bugs fixed during translation
- **Responsive**: Adapts to mobile, tablet, and desktop viewports

## Usage

```tsx
import CodeDisplay from '@/components/CodeDisplay';

<CodeDisplay
  originalCode="PROGRAM HELLO\n  PRINT *, 'Hello'\nEND PROGRAM"
  originalLanguage="FORTRAN"
  translatedCode="def hello():\n    print('Hello')\n\nhello()"
  targetLanguage="Python"
  exorcismReport={[
    {
      id: '1',
      type: 'syntax_error',
      severity: 'critical',
      location: { line: 2, column: 5, snippet: "PRINT *" },
      description: 'Fixed syntax',
      spookyMessage: 'Syntax demon banished',
      fix: 'Converted to Python print()',
    }
  ]}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `originalCode` | `string` | The original legacy source code |
| `originalLanguage` | `LegacyLanguage` | Language of original code (FORTRAN, COBOL, ASSEMBLER, BASIC) |
| `translatedCode` | `string` | The modern translated code |
| `targetLanguage` | `ModernLanguage` | Target language (Python, JavaScript) |
| `exorcismReport` | `BugFix[]` | Array of bugs fixed during translation |

## Styling

The component uses the haunted laboratory aesthetic:
- Background: Pure black (#000000)
- Text: Toxic green (#0f0)
- Accents: Dark green (#003300)
- Font: IBM Plex Mono for code
- Effects: CRT scanlines and flicker

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Scrollable code panels with custom scrollbars
- Responsive design for all viewport sizes

## Requirements Validated

- **4.5**: Display original source code in glowing green terminal font
- **5.1**: Show translated Python code
- **5.2**: Show translated JavaScript code
- **8.3**: Use IBM Plex Mono font with #0f0 color for code
