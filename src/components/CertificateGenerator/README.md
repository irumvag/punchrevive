# CertificateGenerator Component

Creates a downloadable Certificate of Resurrection commemorating the code resurrection.

## Features

- Blood-drip font styling using Creepster font
- Decorative horror elements (skulls, cobwebs, blood drips)
- PNG generation using html-to-image library
- Preview before download
- Includes original language, target language, and resurrection date
- Unique resurrection ID for tracking
- Animated decorative elements
- Fully responsive design

## Usage

```tsx
import CertificateGenerator from '@/components/CertificateGenerator';

<CertificateGenerator
  originalLanguage="FORTRAN"
  targetLanguage="Python"
  resurrectionDate={new Date()}
  cardId="abc123-def456"
/>
```

## Props

- `originalLanguage` (string): The legacy language (e.g., "FORTRAN", "COBOL")
- `targetLanguage` (string): The modern language (e.g., "Python", "JavaScript")
- `resurrectionDate` (Date): The date of resurrection
- `cardId` (string): Unique identifier for the resurrection

## Design

The certificate features:
- Haunted laboratory aesthetic with toxic green (#0f0) on black (#000000)
- Creepster font for blood-drip styling on titles
- IBM Plex Mono for body text
- Decorative elements: cobwebs in corners, skulls on sides, blood drips
- Rotating seal with lightning bolt
- Glowing effects and shadows
- Responsive layout for all screen sizes

## Requirements Validated

- 9.1: Generate Certificate of Resurrection on successful resurrection
- 9.2: Use blood-drip font styling (Creepster)
- 9.3: Include original language, target language, and resurrection date
- 9.4: Provide certificate as downloadable PNG file
