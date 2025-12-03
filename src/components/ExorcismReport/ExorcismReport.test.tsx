/**
 * ExorcismReport component tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExorcismReport from './ExorcismReport';
import type { BugFix } from '@/src/types/punch-card.types';

describe('ExorcismReport', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('displays "No demons detected" message when no bugs are present', () => {
    render(<ExorcismReport fixes={[]} />);
    
    expect(screen.getByText(/No demons detected - code is pure/i)).toBeInTheDocument();
  });

  it('displays the correct number of bugs in the subtitle', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'infinite_loop',
        severity: 'critical',
        location: { line: 10, column: 5, snippet: 'while(true) {}' },
        description: 'Infinite loop detected',
        spookyMessage: 'Infinite loop demon banished',
        fix: 'Added break condition',
      },
      {
        id: 'bug-2',
        type: 'memory_leak',
        severity: 'critical',
        location: { line: 20, column: 3, snippet: 'open(file)' },
        description: 'File not closed',
        spookyMessage: 'Memory leak vampire staked',
        fix: 'Added file.close()',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    expect(screen.getByText(/2 curses banished from the ancient code/i)).toBeInTheDocument();
  });

  it('displays singular "curse" for single bug', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'syntax_error',
        severity: 'critical',
        location: { line: 5, column: 1, snippet: 'if x = 5' },
        description: 'Missing colon',
        spookyMessage: 'Syntax error ghost exorcised',
        fix: 'Added colon after condition',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    expect(screen.getByText(/1 curse banished from the ancient code/i)).toBeInTheDocument();
  });

  it('displays spooky messages for each bug', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'infinite_loop',
        severity: 'critical',
        location: { line: 10, column: 5, snippet: 'while(true) {}' },
        description: 'Infinite loop detected',
        spookyMessage: 'Infinite loop demon banished',
        fix: 'Added break condition',
      },
      {
        id: 'bug-2',
        type: 'undefined_variable',
        severity: 'warning',
        location: { line: 15, column: 8, snippet: 'print(x)' },
        description: 'Variable x not defined',
        spookyMessage: 'Undefined variable specter vanquished',
        fix: 'Declared variable x',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    expect(screen.getByText('Infinite loop demon banished')).toBeInTheDocument();
    expect(screen.getByText('Undefined variable specter vanquished')).toBeInTheDocument();
  });

  it('displays bug locations correctly', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'type_mismatch',
        severity: 'warning',
        location: { line: 42, column: 13, snippet: '"hello" + 5' },
        description: 'Cannot add string and number',
        spookyMessage: 'Type mismatch zombie neutralized',
        fix: 'Converted number to string',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    expect(screen.getByText(/Line 42, Column 13/i)).toBeInTheDocument();
  });

  it('displays code snippets when provided', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'syntax_error',
        severity: 'critical',
        location: { line: 8, column: 1, snippet: 'def foo(' },
        description: 'Missing closing parenthesis',
        spookyMessage: 'Syntax error ghost exorcised',
        fix: 'Added closing parenthesis',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    expect(screen.getByText('def foo(')).toBeInTheDocument();
  });

  it('displays bug descriptions', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'memory_leak',
        severity: 'critical',
        location: { line: 25, column: 4, snippet: 'f = open("data.txt")' },
        description: 'File opened but never closed, causing resource leak',
        spookyMessage: 'Memory leak vampire staked',
        fix: 'Added f.close() at end of function',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    expect(screen.getByText(/File opened but never closed, causing resource leak/i)).toBeInTheDocument();
  });

  it('displays fix descriptions', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'infinite_loop',
        severity: 'critical',
        location: { line: 30, column: 2, snippet: 'while True:' },
        description: 'Loop has no exit condition',
        spookyMessage: 'Infinite loop demon banished',
        fix: 'Added counter and break condition after 100 iterations',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    expect(screen.getByText(/Added counter and break condition after 100 iterations/i)).toBeInTheDocument();
  });

  it('renders all bug fixes', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'syntax_error',
        severity: 'critical',
        location: { line: 1, column: 1, snippet: 'code1' },
        description: 'Bug 1',
        spookyMessage: 'Bug 1 exorcised',
        fix: 'Fix 1',
      },
      {
        id: 'bug-2',
        type: 'syntax_error',
        severity: 'critical',
        location: { line: 2, column: 1, snippet: 'code2' },
        description: 'Bug 2',
        spookyMessage: 'Bug 2 exorcised',
        fix: 'Fix 2',
      },
    ];

    const { container } = render(<ExorcismReport fixes={fixes} />);
    
    // Both bugs should be rendered
    const fixItems = container.querySelectorAll('.fix-item');
    expect(fixItems).toHaveLength(2);
    
    // Check that both spooky messages are present
    expect(screen.getByText('Bug 1 exorcised')).toBeInTheDocument();
    expect(screen.getByText('Bug 2 exorcised')).toBeInTheDocument();
  });

  it('displays report header with bug count', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'syntax_error',
        severity: 'critical',
        location: { line: 1, column: 1, snippet: 'code' },
        description: 'Bug',
        spookyMessage: 'Bug exorcised',
        fix: 'Fix',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    // Report header should be visible
    expect(screen.getByText(/Exorcism Report/i)).toBeInTheDocument();
    expect(screen.getByText(/1 curse banished from the ancient code/i)).toBeInTheDocument();
  });

  it('uses correct severity icons', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'infinite_loop',
        severity: 'critical',
        location: { line: 1, column: 1, snippet: 'code' },
        description: 'Critical bug',
        spookyMessage: 'Critical bug exorcised',
        fix: 'Fix',
      },
      {
        id: 'bug-2',
        type: 'undefined_variable',
        severity: 'warning',
        location: { line: 2, column: 1, snippet: 'code' },
        description: 'Warning bug',
        spookyMessage: 'Warning bug exorcised',
        fix: 'Fix',
      },
      {
        id: 'bug-3',
        type: 'syntax_error',
        severity: 'info',
        location: { line: 3, column: 1, snippet: 'code' },
        description: 'Info bug',
        spookyMessage: 'Info bug exorcised',
        fix: 'Fix',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    // Check that severity icons are present (emojis)
    expect(screen.getByText('🧛')).toBeInTheDocument(); // critical
    expect(screen.getByText('👻')).toBeInTheDocument(); // warning
    expect(screen.getByText('🕷️')).toBeInTheDocument(); // info
  });

  it('applies correct severity CSS classes', () => {
    const fixes: BugFix[] = [
      {
        id: 'bug-1',
        type: 'infinite_loop',
        severity: 'critical',
        location: { line: 1, column: 1, snippet: 'code' },
        description: 'Critical bug',
        spookyMessage: 'Critical bug exorcised',
        fix: 'Fix',
      },
      {
        id: 'bug-2',
        type: 'undefined_variable',
        severity: 'warning',
        location: { line: 2, column: 1, snippet: 'code' },
        description: 'Warning bug',
        spookyMessage: 'Warning bug exorcised',
        fix: 'Fix',
      },
    ];

    render(<ExorcismReport fixes={fixes} />);
    
    const criticalBug = screen.getByText('Critical bug exorcised').closest('.fix-item');
    const warningBug = screen.getByText('Warning bug exorcised').closest('.fix-item');
    
    expect(criticalBug).toHaveClass('severity-critical');
    expect(warningBug).toHaveClass('severity-warning');
  });
});
