'use client';

import { useState } from 'react';
import ResurrectionAnimation from './ResurrectionAnimation';

/**
 * Example usage of ResurrectionAnimation component
 */
export default function ResurrectionAnimationExample() {
  const [showAnimation, setShowAnimation] = useState(false);

  const sampleCode = `# Resurrected FORTRAN code
def calculate_factorial(n):
    """Calculate factorial of n"""
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

# Ancient wisdom preserved
result = calculate_factorial(5)
print(f"Factorial: {result}")`;

  const sampleCardImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjIwMCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFOQ0lFTlQgUFVOQ0ggQ0FSRCBDT0RFPC90ZXh0Pjwvc3ZnPg==';

  const handleComplete = () => {
    console.log('Resurrection animation complete!');
    // In a real app, this would navigate to results page
    setTimeout(() => setShowAnimation(false), 2000);
  };

  return (
    <div style={{ padding: '2rem', background: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: '#0f0', fontFamily: 'Creepster, cursive', textAlign: 'center' }}>
        ResurrectionAnimation Example
      </h1>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={() => setShowAnimation(true)}
          style={{
            padding: '1rem 2rem',
            background: '#001100',
            border: '2px solid #0f0',
            borderRadius: '4px',
            color: '#0f0',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
          }}
        >
          ⚡ Start Resurrection ⚡
        </button>
      </div>

      {showAnimation && (
        <ResurrectionAnimation
          punchCardImage={sampleCardImage}
          translatedCode={sampleCode}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
