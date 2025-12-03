/**
 * Example usage of CodeDisplay component
 * This file demonstrates how to use the CodeDisplay component
 */

import CodeDisplay from './CodeDisplay';
import type { BugFix } from '@/src/types/punch-card.types';

// Example FORTRAN code
const fortranCode = `      PROGRAM HELLO
      IMPLICIT NONE
      CHARACTER(LEN=20) :: NAME
      
      PRINT *, 'ENTER YOUR NAME:'
      READ *, NAME
      PRINT *, 'HELLO, ', NAME
      
      END PROGRAM HELLO`;

// Example translated Python code
const pythonCode = `def hello():
    """
    A simple greeting program
    """
    name = input('Enter your name: ')
    print(f'Hello, {name}')

if __name__ == '__main__':
    hello()`;

// Example bug fixes
const bugFixes: BugFix[] = [
  {
    id: '1',
    type: 'syntax_error',
    severity: 'critical',
    location: {
      line: 6,
      column: 7,
      snippet: "READ *, NAME",
    },
    description: 'Converted FORTRAN READ statement to Python input()',
    spookyMessage: 'Ancient input demon exorcised',
    fix: 'Replaced READ with modern input() function',
  },
  {
    id: '2',
    type: 'syntax_error',
    severity: 'warning',
    location: {
      line: 7,
      column: 7,
      snippet: "PRINT *, 'HELLO, ', NAME",
    },
    description: 'Converted FORTRAN PRINT to Python print with f-string',
    spookyMessage: 'Output vampire staked with modern syntax',
    fix: 'Replaced PRINT with print() and f-string formatting',
  },
];

// Example component usage
export default function CodeDisplayExample() {
  return (
    <div style={{ padding: '2rem', background: '#000' }}>
      <CodeDisplay
        originalCode={fortranCode}
        originalLanguage="FORTRAN"
        translatedCode={pythonCode}
        targetLanguage="Python"
        exorcismReport={bugFixes}
      />
    </div>
  );
}

// Example with JavaScript translation
const cobolCode = `       IDENTIFICATION DIVISION.
       PROGRAM-ID. CALCULATOR.
       
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 NUM1 PIC 9(3).
       01 NUM2 PIC 9(3).
       01 RESULT PIC 9(4).
       
       PROCEDURE DIVISION.
           DISPLAY "ENTER FIRST NUMBER: ".
           ACCEPT NUM1.
           DISPLAY "ENTER SECOND NUMBER: ".
           ACCEPT NUM2.
           ADD NUM1 TO NUM2 GIVING RESULT.
           DISPLAY "RESULT: " RESULT.
           STOP RUN.`;

const javascriptCode = `/**
 * Simple calculator program
 */
function calculator() {
  const num1 = parseInt(prompt('Enter first number: '));
  const num2 = parseInt(prompt('Enter second number: '));
  const result = num1 + num2;
  console.log(\`Result: \${result}\`);
}

calculator();`;

export function CodeDisplayJavaScriptExample() {
  return (
    <div style={{ padding: '2rem', background: '#000' }}>
      <CodeDisplay
        originalCode={cobolCode}
        originalLanguage="COBOL"
        translatedCode={javascriptCode}
        targetLanguage="JavaScript"
        exorcismReport={[
          {
            id: '1',
            type: 'type_mismatch',
            severity: 'warning',
            location: {
              line: 11,
              column: 12,
              snippet: 'ACCEPT NUM1',
            },
            description: 'Added type conversion for user input',
            spookyMessage: 'Type confusion ghost banished',
            fix: 'Wrapped prompt() with parseInt() for numeric conversion',
          },
        ]}
      />
    </div>
  );
}
