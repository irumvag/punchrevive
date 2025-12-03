/**
 * ExorcismReport component usage example
 */

import ExorcismReport from './ExorcismReport';
import type { BugFix } from '@/src/types/punch-card.types';

/**
 * Example 1: Multiple bugs with different severities
 */
export function ExampleWithMultipleBugs() {
  const fixes: BugFix[] = [
    {
      id: 'bug-1',
      type: 'infinite_loop',
      severity: 'critical',
      location: {
        line: 42,
        column: 5,
        snippet: 'while(true) { /* no break */ }',
      },
      description: 'Loop has no exit condition, causing infinite execution',
      spookyMessage: 'Infinite loop demon banished',
      fix: 'Added break condition after 100 iterations',
    },
    {
      id: 'bug-2',
      type: 'memory_leak',
      severity: 'critical',
      location: {
        line: 58,
        column: 3,
        snippet: 'f = open("data.txt", "r")',
      },
      description: 'File opened but never closed, causing resource leak',
      spookyMessage: 'Memory leak vampire staked',
      fix: 'Added f.close() at end of function',
    },
    {
      id: 'bug-3',
      type: 'undefined_variable',
      severity: 'warning',
      location: {
        line: 15,
        column: 8,
        snippet: 'print(result)',
      },
      description: 'Variable "result" used before declaration',
      spookyMessage: 'Undefined variable specter vanquished',
      fix: 'Declared result = 0 before use',
    },
    {
      id: 'bug-4',
      type: 'type_mismatch',
      severity: 'warning',
      location: {
        line: 23,
        column: 12,
        snippet: 'total = "count: " + count',
      },
      description: 'Cannot concatenate string and integer',
      spookyMessage: 'Type mismatch zombie neutralized',
      fix: 'Converted count to string: str(count)',
    },
    {
      id: 'bug-5',
      type: 'syntax_error',
      severity: 'critical',
      location: {
        line: 8,
        column: 1,
        snippet: 'def calculate_sum(',
      },
      description: 'Missing closing parenthesis in function definition',
      spookyMessage: 'Syntax error ghost exorcised',
      fix: 'Added closing parenthesis',
    },
  ];

  return <ExorcismReport fixes={fixes} />;
}

/**
 * Example 2: Single bug
 */
export function ExampleWithSingleBug() {
  const fixes: BugFix[] = [
    {
      id: 'bug-1',
      type: 'infinite_loop',
      severity: 'critical',
      location: {
        line: 10,
        column: 2,
        snippet: 'DO 10 I=1,N\n10 CONTINUE',
      },
      description: 'FORTRAN loop missing proper termination condition',
      spookyMessage: 'Eternal cycle curse broken',
      fix: 'Added proper loop exit condition',
    },
  ];

  return <ExorcismReport fixes={fixes} />;
}

/**
 * Example 3: No bugs (pure code)
 */
export function ExampleWithNoBugs() {
  return <ExorcismReport fixes={[]} />;
}

/**
 * Example 4: COBOL legacy code bugs
 */
export function ExampleWithCOBOLBugs() {
  const fixes: BugFix[] = [
    {
      id: 'bug-1',
      type: 'memory_leak',
      severity: 'critical',
      location: {
        line: 125,
        column: 8,
        snippet: 'OPEN INPUT CUSTOMER-FILE',
      },
      description: 'File opened in PROCEDURE DIVISION but never closed',
      spookyMessage: 'Resource drain phantom vanquished',
      fix: 'Added CLOSE CUSTOMER-FILE before STOP RUN',
    },
    {
      id: 'bug-2',
      type: 'undefined_variable',
      severity: 'warning',
      location: {
        line: 89,
        column: 12,
        snippet: 'MOVE TOTAL-AMOUNT TO DISPLAY-FIELD',
      },
      description: 'TOTAL-AMOUNT not defined in WORKING-STORAGE SECTION',
      spookyMessage: 'Phantom variable exorcised',
      fix: 'Added 01 TOTAL-AMOUNT PIC 9(8)V99 to WORKING-STORAGE',
    },
  ];

  return <ExorcismReport fixes={fixes} />;
}

/**
 * Example 5: Assembly language bugs
 */
export function ExampleWithAssemblyBugs() {
  const fixes: BugFix[] = [
    {
      id: 'bug-1',
      type: 'infinite_loop',
      severity: 'critical',
      location: {
        line: 34,
        column: 1,
        snippet: 'LOOP: JMP LOOP',
      },
      description: 'Unconditional jump creates infinite loop',
      spookyMessage: 'Endless iteration specter exorcised',
      fix: 'Added conditional jump with counter check',
    },
    {
      id: 'bug-2',
      type: 'memory_leak',
      severity: 'critical',
      location: {
        line: 67,
        column: 5,
        snippet: 'CALL MALLOC',
      },
      description: 'Memory allocated but never freed',
      spookyMessage: 'Allocation ghost purified',
      fix: 'Added CALL FREE before RET',
    },
  ];

  return <ExorcismReport fixes={fixes} />;
}

/**
 * Example 6: All severity levels
 */
export function ExampleWithAllSeverities() {
  const fixes: BugFix[] = [
    {
      id: 'bug-1',
      type: 'infinite_loop',
      severity: 'critical',
      location: {
        line: 10,
        column: 2,
        snippet: 'while True:',
      },
      description: 'Critical: Infinite loop with no exit',
      spookyMessage: 'Infinite loop demon banished',
      fix: 'Added break condition',
    },
    {
      id: 'bug-2',
      type: 'undefined_variable',
      severity: 'warning',
      location: {
        line: 20,
        column: 5,
        snippet: 'x = y + 1',
      },
      description: 'Warning: Variable y not defined',
      spookyMessage: 'Undefined variable specter vanquished',
      fix: 'Declared y = 0',
    },
    {
      id: 'bug-3',
      type: 'type_mismatch',
      severity: 'info',
      location: {
        line: 30,
        column: 8,
        snippet: 'result = "5" + 3',
      },
      description: 'Info: Implicit type conversion',
      spookyMessage: 'Type confusion curse lifted',
      fix: 'Made conversion explicit',
    },
  ];

  return <ExorcismReport fixes={fixes} />;
}
