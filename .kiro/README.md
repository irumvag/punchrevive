# Kiro Integration Directory

This directory contains all Kiro IDE integration artifacts that demonstrate spec-driven development, agent hooks, steering documents, and custom MCP extensions.

## Directory Structure

### `/specs/punch-revive/`
Complete specification documents for the PunchRevive feature:
- **requirements.md** - User stories and acceptance criteria following EARS patterns
- **design.md** - Comprehensive design document with correctness properties
- **tasks.md** - Implementation plan with numbered tasks and property-based test annotations

### `/hooks/`
Agent hooks that automate quality checks and processing pipelines:
- **pre-commit.yaml** - Curse Detector hook for AI-powered lint feedback with spooky terminology
- **post-upload.yaml** - Resurrection pipeline hook that triggers OCR-decode-translate workflow

### `/steering/`
Steering documents that enforce consistent aesthetics and code standards:
- **haunted-aesthetic.md** - Color palette, typography, and tone guidelines for retro-horror theme
- **code-standards.md** - File organization, naming conventions, and testing requirements

### `/mcp/`
Custom Model Context Protocol extension for punch card operations:
- **punch-card-mcp/** - MCP server implementation with EBCDIC decoding and legacy translation tools

### `/settings/`
Kiro IDE configuration:
- **mcp.json** - MCP server configuration for punch card operations

## Purpose

This directory showcases how Kiro IDE enables:

1. **Spec-Driven Development**: Transform rough ideas into detailed requirements, design, and implementation plans
2. **Agent Hooks**: Automate repetitive tasks and quality checks during development
3. **Steering Documents**: Maintain consistent aesthetics and code quality across AI-generated code
4. **Custom MCP Extensions**: Extend Kiro's capabilities with domain-specific tools

## For Hackathon Judges

This directory is intentionally committed to version control to demonstrate the complete Kiro workflow. Each artifact played a crucial role in building PunchRevive efficiently and maintaining quality throughout development.

See the main README.md for quantified comparisons of development time savings using these Kiro features.
