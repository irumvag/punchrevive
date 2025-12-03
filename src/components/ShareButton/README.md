# ShareButton Component

## Overview

The ShareButton component generates shareable links and social media cards for resurrected code. It provides a haunted laboratory-themed interface for sharing resurrection results across multiple platforms.

## Features

- **Unique Shareable URLs**: Generates unique URLs for each resurrection result
- **Social Media Integration**: Share to Twitter/X, Facebook, and LinkedIn
- **Copy to Clipboard**: One-click copy with spooky confirmation message
- **Responsive Design**: Adapts to mobile, tablet, and desktop viewports
- **Haunted Aesthetic**: Consistent with the retro horror laboratory theme

## Usage

```tsx
import ShareButton from '@/components/ShareButton';

function ResultsPage() {
  return (
    <ShareButton
      resultId="unique-resurrection-id"
      punchCardPreview="base64-or-url-of-card-image"
      codeSnippet="snippet-of-translated-code"
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `resultId` | `string` | Yes | Unique identifier for the resurrection result |
| `punchCardPreview` | `string` | Yes | Base64 or URL of the punch card image for preview |
| `codeSnippet` | `string` | Yes | Snippet of the translated code for preview |

## Share Options

### Copy Link
- Copies the shareable URL to clipboard
- Shows spooky confirmation: "The link has been captured by the spirits!"
- Confirmation auto-dismisses after 3 seconds

### Twitter/X
- Opens Twitter share dialog in new window
- Pre-filled text: "I just resurrected dead code #PunchRevive"
- Includes shareable URL

### Facebook
- Opens Facebook share dialog in new window
- Includes shareable URL

### LinkedIn
- Opens LinkedIn share dialog in new window
- Includes shareable URL

## Shareable URL Format

The component generates URLs in the format:
```
https://your-domain.com/share/{resultId}
```

The base URL is determined by:
1. `window.location.origin` (client-side)
2. `process.env.NEXT_PUBLIC_APP_URL` (fallback)
3. `http://localhost:3000` (development fallback)

## Open Graph Tags

For proper social media previews, ensure your `/share/[id]` page includes Open Graph meta tags:

```tsx
<meta property="og:title" content="I just resurrected dead code #PunchRevive" />
<meta property="og:description" content="Check out this resurrected punch card code" />
<meta property="og:image" content={punchCardPreview} />
<meta property="og:url" content={shareUrl} />
<meta name="twitter:card" content="summary_large_image" />
```

## Styling

The component uses:
- **Colors**: Black (#000000), toxic green (#0f0), dark green (#003300)
- **Fonts**: IBM Plex Mono for UI text, Creepster for headers
- **Effects**: Glow effects, fade-in animations, floating ghost icons

## Accessibility

- All buttons have proper `aria-label` attributes
- Share menu has `aria-expanded` state
- Keyboard navigation supported
- Touch targets meet 44×44px minimum on mobile
- Focus indicators visible

## Responsive Behavior

### Desktop (>768px)
- Share menu appears below button as dropdown
- Grid layout for share options (2 columns)

### Mobile (≤768px)
- Share menu appears as centered modal
- Single column layout for share options
- Fixed notification positioning

## Requirements Validated

- **Requirement 10.1**: Generates unique shareable URLs
- **Requirement 10.3**: Creates Twitter/X preview card
- **Requirement 10.4**: Displays share options (Twitter, Facebook, LinkedIn, Copy)

## Testing

The component can be tested with:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ShareButton from './ShareButton';

test('copies link to clipboard', async () => {
  render(
    <ShareButton
      resultId="test-id"
      punchCardPreview="test-preview"
      codeSnippet="test-code"
    />
  );
  
  const shareButton = screen.getByText(/Share Resurrection/i);
  fireEvent.click(shareButton);
  
  const copyButton = screen.getByText(/Copy Link/i);
  fireEvent.click(copyButton);
  
  expect(screen.getByText(/Link Captured!/i)).toBeInTheDocument();
});
```

## Browser Compatibility

- Requires `navigator.clipboard` API for copy functionality
- Falls back to alert if clipboard API unavailable
- Social share links work in all modern browsers
