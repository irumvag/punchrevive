/**
 * ShareButton Component Example
 * 
 * Demonstrates usage of the ShareButton component with sample data
 */

import ShareButton from './ShareButton';

export default function ShareButtonExample() {
  // Sample resurrection result data
  const sampleResultId = 'abc123-def456-ghi789';
  const samplePunchCardPreview = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const sampleCodeSnippet = `
def hello_world():
    print("Hello from the digital graveyard!")
    return "Resurrected successfully"
  `.trim();

  return (
    <div style={{ 
      padding: '2rem', 
      background: '#000000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem'
    }}>
      <div style={{
        fontFamily: 'Creepster, cursive',
        fontSize: '2rem',
        color: '#0f0',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(0, 255, 0, 0.8)',
        marginBottom: '1rem'
      }}>
        ShareButton Component Example
      </div>

      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '1rem',
        color: '#003300',
        textAlign: 'center',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Click the button below to see the share menu with options to copy the link
        or share to social media platforms. The component includes spooky confirmations
        and haunted laboratory styling.
      </div>

      {/* ShareButton Component */}
      <ShareButton
        resultId={sampleResultId}
        punchCardPreview={samplePunchCardPreview}
        codeSnippet={sampleCodeSnippet}
      />

      {/* Sample Result Info */}
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.85rem',
        color: '#003300',
        background: '#001100',
        border: '1px solid #003300',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ color: '#0f0', marginBottom: '1rem', fontWeight: 'bold' }}>
          Sample Data:
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#0f0' }}>Result ID:</strong> {sampleResultId}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#0f0' }}>Shareable URL:</strong> /share/{sampleResultId}
        </div>
        <div>
          <strong style={{ color: '#0f0' }}>Share Text:</strong> I just resurrected dead code #PunchRevive
        </div>
      </div>

      {/* Feature List */}
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.85rem',
        color: '#003300',
        background: '#001100',
        border: '1px solid #003300',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ color: '#0f0', marginBottom: '1rem', fontWeight: 'bold' }}>
          Features:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Copy link to clipboard with spooky confirmation</li>
          <li>Share to Twitter/X with pre-filled text</li>
          <li>Share to Facebook</li>
          <li>Share to LinkedIn</li>
          <li>Responsive design for mobile, tablet, and desktop</li>
          <li>Haunted laboratory aesthetic with green glow effects</li>
          <li>Accessible with proper ARIA labels</li>
          <li>Touch-friendly on mobile devices</li>
        </ul>
      </div>

      {/* Usage Instructions */}
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.85rem',
        color: '#003300',
        background: '#001100',
        border: '1px solid #003300',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ color: '#0f0', marginBottom: '1rem', fontWeight: 'bold' }}>
          Usage:
        </div>
        <pre style={{ 
          margin: 0, 
          color: '#0f0',
          background: '#000000',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '0.75rem'
        }}>
{`import ShareButton from '@/components/ShareButton';

<ShareButton
  resultId="unique-resurrection-id"
  punchCardPreview="base64-or-url"
  codeSnippet="code-snippet"
/>`}
        </pre>
      </div>
    </div>
  );
}
