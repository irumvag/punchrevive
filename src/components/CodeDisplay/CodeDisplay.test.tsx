import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CodeDisplay from './CodeDisplay';
import type { BugFix, LegacyLanguage, ModernLanguage } from '@/src/types/punch-card.types';

// Mock Prism
vi.mock('prismjs', () => ({
  default: {
    highlightElement: vi.fn(),
  },
}));

vi.mock('prismjs/components/prism-python', () => ({}));
vi.mock('prismjs/components/prism-javascript', () => ({}));

describe('CodeDisplay', () => {
  const mockOriginalCode = `PROGRAM HELLO
  PRINT *, 'Hello World'
END PROGRAM HELLO`;

  const mockTranslatedCode = `def hello():
    print('Hello World')

hello()`;

  const mockBugFixes: BugFix[] = [
    {
      id: '1',
      type: 'syntax_error',
      severity: 'critical',
      location: {
        line: 2,
        column: 5,
        snippet: "PRINT *, 'Hello World'",
      },
      description: 'Missing semicolon',
      spookyMessage: 'Syntax demon banished',
      fix: 'Added proper Python syntax',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with original and translated code', () => {
    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={mockBugFixes}
      />
    );

    expect(screen.getByText('Code Resurrection Complete')).toBeInTheDocument();
    expect(screen.getByText('Original Code')).toBeInTheDocument();
    expect(screen.getByText('Resurrected Code')).toBeInTheDocument();
  });

  it('displays the correct language badges', () => {
    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    expect(screen.getByText('FORTRAN')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('displays the original code content', () => {
    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    expect(screen.getByText(/PROGRAM HELLO/)).toBeInTheDocument();
  });

  it('displays the translated code content', () => {
    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    expect(screen.getByText(/def hello\(\):/)).toBeInTheDocument();
  });

  it('shows bug fixes summary when bugs are present', () => {
    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={mockBugFixes}
      />
    );

    expect(screen.getByText('1 demon exorcised')).toBeInTheDocument();
  });

  it('shows correct plural form for multiple bugs', () => {
    const multipleBugs: BugFix[] = [
      ...mockBugFixes,
      {
        id: '2',
        type: 'infinite_loop',
        severity: 'critical',
        location: {
          line: 5,
          column: 1,
          snippet: 'DO 10 I=1,100',
        },
        description: 'Infinite loop detected',
        spookyMessage: 'Infinite loop demon banished',
        fix: 'Fixed loop termination',
      },
    ];

    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={multipleBugs}
      />
    );

    expect(screen.getByText('2 demons exorcised')).toBeInTheDocument();
  });

  it('does not show bug summary when no bugs are present', () => {
    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    expect(screen.queryByText(/demon/)).not.toBeInTheDocument();
  });

  it('renders line numbers for original code', () => {
    render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    // Check that line numbers are rendered
    const lineNumbers = screen.getAllByText('1');
    expect(lineNumbers.length).toBeGreaterThan(0);
  });

  it('handles different target languages', () => {
    const { rerender } = render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="COBOL"
        translatedCode="console.log('Hello World');"
        targetLanguage="JavaScript"
        exorcismReport={[]}
      />
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('COBOL')).toBeInTheDocument();

    rerender(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="BASIC"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('BASIC')).toBeInTheDocument();
  });

  it('applies haunted laboratory styling', () => {
    const { container } = render(
      <CodeDisplay
        originalCode={mockOriginalCode}
        originalLanguage="FORTRAN"
        translatedCode={mockTranslatedCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    const displayContainer = container.querySelector('.code-display-container');
    expect(displayContainer).toBeInTheDocument();
  });

  it('handles empty code gracefully', () => {
    render(
      <CodeDisplay
        originalCode=""
        originalLanguage="FORTRAN"
        translatedCode=""
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    expect(screen.getByText('Code Resurrection Complete')).toBeInTheDocument();
  });

  it('handles multiline code correctly', () => {
    const multilineCode = `line 1
line 2
line 3
line 4
line 5`;

    render(
      <CodeDisplay
        originalCode={multilineCode}
        originalLanguage="FORTRAN"
        translatedCode={multilineCode}
        targetLanguage="Python"
        exorcismReport={[]}
      />
    );

    // Should have line numbers for each line
    const lineNumbers = screen.getAllByText('5');
    expect(lineNumbers.length).toBeGreaterThan(0);
  });
});
