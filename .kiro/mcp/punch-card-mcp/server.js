#!/usr/bin/env node

/**
 * PunchCard MCP Server
 * 
 * Provides punch card operations as native Kiro IDE capabilities:
 * - ebcdic_decode: Decode punch patterns to text
 * - legacy_translate: Translate legacy code to modern languages
 * - validate_punch_pattern: Validate punch card patterns
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// IBM 029 EBCDIC encoding map (simplified for demonstration)
const IBM029_MAP = {
  '12-0': 'A', '12-1': 'B', '12-2': 'C', '12-3': 'D', '12-4': 'E',
  '12-5': 'F', '12-6': 'G', '12-7': 'H', '12-8': 'I', '12-9': 'J',
  '11-0': 'K', '11-1': 'L', '11-2': 'M', '11-3': 'N', '11-4': 'O',
  '11-5': 'P', '11-6': 'Q', '11-7': 'R', '11-8': 'S', '11-9': 'T',
  '0-1': 'U', '0-2': 'V', '0-3': 'W', '0-4': 'X', '0-5': 'Y',
  '0-6': 'Z', '0': '0', '1': '1', '2': '2', '3': '3',
  '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '11': '-', '0-8': '+', '12-8-3': '.', '11-8-3': ',',
  '12-8-4': '(', '11-8-4': ')', '0-8-3': '=', '12-8-5': '*',
  '11-8-5': '/', '0-8-4': ' '
};

// IBM 026 EBCDIC encoding map (simplified, slightly different from 029)
const IBM026_MAP = {
  ...IBM029_MAP,
  '12-8-3': '$', // Different from 029
  '11-8-3': '@', // Different from 029
};

/**
 * Decode a punch pattern to text using EBCDIC encoding
 */
function ebcdicDecode(pattern, encoding = 'IBM029') {
  const map = encoding === 'IBM026' ? IBM026_MAP : IBM029_MAP;
  let result = '';
  
  // Pattern should be 12 rows x 80 columns
  if (!Array.isArray(pattern) || pattern.length !== 12) {
    throw new Error('Invalid pattern: must be 12 rows');
  }
  
  const numColumns = pattern[0]?.length || 0;
  
  // Process each column
  for (let col = 0; col < numColumns; col++) {
    const punches = [];
    
    // Check which rows are punched in this column
    for (let row = 0; row < 12; row++) {
      if (pattern[row][col]) {
        punches.push(row);
      }
    }
    
    // Convert punch positions to character
    if (punches.length === 0) {
      result += ' '; // No punches = space
    } else {
      const key = punches.join('-');
      result += map[key] || '?'; // Unknown pattern = ?
    }
  }
  
  return result;
}

/**
 * Validate a punch pattern
 */
function validatePunchPattern(pattern) {
  const errors = [];
  
  if (!Array.isArray(pattern)) {
    errors.push('Pattern must be an array');
    return { valid: false, errors };
  }
  
  if (pattern.length !== 12) {
    errors.push(`Pattern must have 12 rows, got ${pattern.length}`);
  }
  
  for (let i = 0; i < pattern.length; i++) {
    if (!Array.isArray(pattern[i])) {
      errors.push(`Row ${i} must be an array`);
      continue;
    }
    
    if (pattern[i].length !== 80) {
      errors.push(`Row ${i} must have 80 columns, got ${pattern[i].length}`);
    }
    
    for (let j = 0; j < pattern[i].length; j++) {
      if (typeof pattern[i][j] !== 'boolean') {
        errors.push(`Cell [${i}][${j}] must be boolean, got ${typeof pattern[i][j]}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    dimensions: {
      rows: pattern.length,
      columns: pattern[0]?.length || 0
    }
  };
}

/**
 * Translate legacy code to modern language (simplified mock)
 */
function legacyTranslate(sourceCode, sourceLang, targetLang) {
  // This is a simplified mock for demonstration
  // In production, this would call the actual AI translation service
  
  const translations = {
    'FORTRAN': {
      'Python': `# Translated from FORTRAN\n# Original code:\n# ${sourceCode.split('\n')[0]}\n\ndef main():\n    print("Hello from resurrected FORTRAN!")\n\nif __name__ == "__main__":\n    main()`,
      'JavaScript': `// Translated from FORTRAN\n// Original code:\n// ${sourceCode.split('\n')[0]}\n\nfunction main() {\n  console.log("Hello from resurrected FORTRAN!");\n}\n\nmain();`
    },
    'COBOL': {
      'Python': `# Translated from COBOL\n\ndef main():\n    print("Hello from resurrected COBOL!")\n\nif __name__ == "__main__":\n    main()`,
      'JavaScript': `// Translated from COBOL\n\nfunction main() {\n  console.log("Hello from resurrected COBOL!");\n}\n\nmain();`
    }
  };
  
  return translations[sourceLang]?.[targetLang] || 
    `// Translation from ${sourceLang} to ${targetLang} not available in mock`;
}

// Create MCP server
const server = new Server(
  {
    name: 'punch-card-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'ebcdic_decode',
        description: 'Decode a punch card pattern to text using EBCDIC encoding (IBM 029 or IBM 026)',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'array',
              description: 'A 12x80 boolean array representing punch holes',
              items: {
                type: 'array',
                items: { type: 'boolean' }
              }
            },
            encoding: {
              type: 'string',
              description: 'EBCDIC encoding standard to use',
              enum: ['IBM029', 'IBM026'],
              default: 'IBM029'
            }
          },
          required: ['pattern']
        }
      },
      {
        name: 'legacy_translate',
        description: 'Translate legacy code (FORTRAN, COBOL, etc.) to modern languages (Python, JavaScript)',
        inputSchema: {
          type: 'object',
          properties: {
            sourceCode: {
              type: 'string',
              description: 'The legacy source code to translate'
            },
            sourceLang: {
              type: 'string',
              description: 'Source language',
              enum: ['FORTRAN', 'COBOL', 'ASSEMBLER', 'BASIC']
            },
            targetLang: {
              type: 'string',
              description: 'Target language',
              enum: ['Python', 'JavaScript']
            }
          },
          required: ['sourceCode', 'sourceLang', 'targetLang']
        }
      },
      {
        name: 'validate_punch_pattern',
        description: 'Validate a punch card pattern for correctness (12 rows x 80 columns)',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'array',
              description: 'A punch card pattern to validate',
              items: {
                type: 'array',
                items: { type: 'boolean' }
              }
            }
          },
          required: ['pattern']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'ebcdic_decode': {
        const { pattern, encoding = 'IBM029' } = args;
        const decoded = ebcdicDecode(pattern, encoding);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                decoded,
                encoding,
                length: decoded.length
              }, null, 2)
            }
          ]
        };
      }
      
      case 'legacy_translate': {
        const { sourceCode, sourceLang, targetLang } = args;
        const translated = legacyTranslate(sourceCode, sourceLang, targetLang);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                translatedCode: translated,
                sourceLang,
                targetLang
              }, null, 2)
            }
          ]
        };
      }
      
      case 'validate_punch_pattern': {
        const { pattern } = args;
        const validation = validatePunchPattern(pattern);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(validation, null, 2)
            }
          ]
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('PunchCard MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
