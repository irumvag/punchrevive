# PunchCard MCP Server

Custom Model Context Protocol (MCP) server for PunchRevive that extends Kiro IDE with native punch card operations.

## Features

### Tools

1. **ebcdic_decode**
   - Decodes punch card patterns to text using EBCDIC encoding
   - Supports IBM 029 and IBM 026 encoding standards
   - Input: 12×80 boolean array representing punch holes
   - Output: Decoded text string

2. **legacy_translate**
   - Translates legacy code to modern languages
   - Supports: FORTRAN, COBOL, ASSEMBLER, BASIC → Python, JavaScript
   - Input: Source code, source language, target language
   - Output: Translated code

3. **validate_punch_pattern**
   - Validates punch card patterns for correctness
   - Checks dimensions (12 rows × 80 columns)
   - Validates data types (boolean values)
   - Output: Validation result with errors

## Installation

This MCP server is automatically configured when you set up the PunchRevive project. The configuration is in `.kiro/settings/mcp.json`.

## Usage in Kiro IDE

Once configured, these tools are available as native IDE commands:

```javascript
// Example: Decode a punch pattern
const pattern = [
  [true, false, false, ...], // Row 0 (12-punch)
  [false, true, false, ...], // Row 1 (11-punch)
  // ... 10 more rows
];

// Call via MCP
const result = await kiro.mcp.call('ebcdic_decode', {
  pattern,
  encoding: 'IBM029'
});
```

## Development

To test the server locally:

```bash
cd .kiro/mcp/punch-card-mcp
node server.js
```

The server communicates via stdio and follows the MCP protocol specification.

## Architecture

- **server.js**: Main MCP server implementation
- **package.json**: Node.js package configuration
- **README.md**: This file

## EBCDIC Encoding

The server implements simplified IBM 029 and IBM 026 EBCDIC encoding maps. These maps translate 12-bit punch patterns to characters:

- Rows 0-9: Numeric zone
- Row 11: Zone punch
- Row 12: Zone punch
- Combinations create letters, numbers, and special characters

## License

MIT
