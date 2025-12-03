# Kiro Integration Artifacts

This document describes the Kiro IDE integration artifacts created for PunchRevive.

## Overview

Task 2 has been completed, implementing three key Kiro integration features:
1. Steering documents for aesthetic and code standards
2. Agent hooks for automated workflows
3. Custom MCP extension for punch card operations

## 1. Steering Documents

### Haunted Aesthetic Guidelines
**Location:** `.kiro/steering/haunted-aesthetic.md`

Enforces the retro-horror theme across all generated code and content:
- Color palette: #000000 (black), #0f0 (toxic green), #003300 (dark green)
- Typography: IBM Plex Mono for code, Creepster for headings
- Tone: Horror/resurrection metaphors
- Visual elements: Cobwebs, CRT effects, ghost animations

### Code Standards
**Location:** `.kiro/steering/code-standards.md`

Defines project-wide coding conventions:
- File organization patterns
- Naming conventions (PascalCase, camelCase, kebab-case)
- TypeScript strict mode requirements
- Testing standards with property-based testing tags

## 2. Agent Hooks

### Pre-Commit Hook: Curse Detector
**Location:** `.kiro/hooks/pre-commit.yaml`

Automatically runs before commits to provide AI-powered code quality feedback with spooky terminology:
- "Memory leak vampire detected"
- "Infinite loop demon lurking"
- "Undefined variable ghost haunting"
- "Type mismatch zombie shambling"

### Post-Upload Hook: Resurrection Pipeline
**Location:** `.kiro/hooks/post-upload.yaml`

Triggers automatically when punch card images are uploaded:
- Filters: *.png, *.jpg, *.jpeg, *.webp
- Executes: OCR → Decode → Translate pipeline
- Command: `npm run process-card -- {{uploaded_file}}`

## 3. Custom MCP Extension

### PunchCard MCP Server
**Location:** `.kiro/mcp/punch-card-mcp/`

Extends Kiro IDE with native punch card operations:

#### Tools Provided:

1. **ebcdic_decode**
   - Decodes 12×80 punch patterns to text
   - Supports IBM 029 and IBM 026 encodings
   - Auto-approved for seamless use

2. **legacy_translate**
   - Translates FORTRAN, COBOL, ASSEMBLER, BASIC
   - Outputs Python or JavaScript
   - Simplified mock for demonstration

3. **validate_punch_pattern**
   - Validates pattern dimensions (12×80)
   - Checks data types (boolean arrays)
   - Auto-approved for seamless use

#### Configuration
**Location:** `.kiro/settings/mcp.json`

```json
{
  "mcpServers": {
    "punch-card-mcp": {
      "command": "node",
      "args": [".kiro/mcp/punch-card-mcp/server.js"],
      "disabled": false,
      "autoApprove": ["ebcdic_decode", "validate_punch_pattern"]
    }
  }
}
```

## Usage

### Steering Documents
These are automatically included in all Kiro agent interactions (marked with `inclusion: always`). The agent will reference these guidelines when generating code or content.

### Agent Hooks
Hooks are triggered automatically based on their configured events:
- Pre-commit: Runs when you commit code
- Post-upload: Runs when you upload image files

### MCP Extension
Once the MCP server is running, tools are available in Kiro IDE:
```javascript
// Example usage
const result = await kiro.mcp.call('ebcdic_decode', {
  pattern: [[true, false, ...], ...],
  encoding: 'IBM029'
});
```

## Requirements Validated

This implementation satisfies:
- **Requirement 13.1-13.4**: Steering documents for aesthetic consistency
- **Requirement 12.1-12.4**: Agent hooks for automation
- **Requirement 14.1-14.5**: Custom MCP extension for punch card operations

## Next Steps

To activate the MCP server:
1. Ensure Node.js is installed
2. The server will auto-start when Kiro loads the configuration
3. Check the MCP Server view in Kiro to verify it's running
4. Use the tools in your development workflow

## Files Created

```
.kiro/
├── steering/
│   ├── haunted-aesthetic.md
│   └── code-standards.md
├── hooks/
│   ├── pre-commit.yaml
│   └── post-upload.yaml
├── mcp/
│   └── punch-card-mcp/
│       ├── server.js
│       ├── package.json
│       └── README.md
└── settings/
    └── mcp.json
```

All artifacts are committed to version control and visible to hackathon judges.
