# Neon AI Rules - Project Documentation

## Project Overview

This repository contains a comprehensive suite of AI-powered development tools for Neon, including:

1. **Context Rules** (`.mdc` files): Markdown Context files that guide AI systems
2. **Claude Code Plugin**: Full-featured plugin with guided skills and MCP server integration
3. **Neon SDK Rules**: Guidelines for TypeScript and Python SDKs

The primary audience includes AI developers using Claude, Cursor, and other AI-powered code assistants who work with Neon databases.

## Repository Structure

```
.
├── *.mdc                          # Context rule files (13 total)
├── dev-marketplace/               # Claude Code plugin and marketplace integration
│   ├── neon-plugin/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json        # Plugin metadata
│   │   ├── .mcp.json              # MCP server configuration
│   │   └── skills/                # Guided skills for Claude Code
│   │       ├── add-neon-docs/      # Documentation reference installer
│   │       ├── neon-drizzle/
│   │       │   ├── guides/         # Step-by-step workflow guides
│   │       │   ├── references/     # Technical reference docs
│   │       │   ├── scripts/        # Utility scripts
│   │       │   └── templates/      # Code templates
│   │       ├── neon-serverless/
│   │       └── neon-toolkit/
│   └── .claude-plugin/
│       └── marketplace.json       # Marketplace metadata
├── .claude/
│   └── settings.local.json        # Local Claude Code settings
├── .serena/                       # Serena code intelligence cache
├── README.md                      # User-facing documentation
└── CLAUDE.md                      # This file

```

## Context Rules (.mdc files)

### Core Integration Rules (4 files)
- **neon-auth.mdc**: Stack Auth + Neon Auth authentication patterns
- **neon-serverless.mdc**: Serverless database connections and pooling
- **neon-drizzle.mdc**: Drizzle ORM integration with Neon
- **neon-toolkit.mdc**: Ephemeral database creation for testing

### SDK Rules (2 files)
- **neon-typescript-sdk.mdc**: TypeScript SDK usage patterns
- **neon-python-sdk.mdc**: Python SDK usage patterns

### API Rules (7 files)
- **neon-api-guidelines.mdc**: General API best practices
- **neon-api-projects.mdc**: Project management API
- **neon-api-branches.mdc**: Branch management API
- **neon-api-endpoints.mdc**: Compute endpoint management API
- **neon-api-organizations.mdc**: Organization and role management API
- **neon-api-keys.mdc**: API key and authentication management
- **neon-api-operations.mdc**: Operation execution and monitoring

## Claude Code Plugin Structure

### Plugin Configuration
- `.claude-plugin/plugin.json`: Contains plugin metadata (name, version, description)
- `.mcp.json`: Configures connection to Neon's remote MCP server

### Skills Directory
Each skill is self-contained with multiple components:

1. **SKILL.md**: Describes the skill's purpose and workflow
2. **scripts/**: Executable utilities for the skill (TypeScript or shell)
3. **templates/**: Code examples and templates
4. **guides/** (optional): Step-by-step guides for different scenarios
5. **references/** (optional): Technical reference documentation

#### Neon Drizzle Skill
- **Purpose**: Drizzle ORM setup and database management with comprehensive workflow support
- **Scripts**: `generate-schema.ts`, `run-migration.ts`
- **Templates**: Schema examples, drizzle config (HTTP and WebSocket adapters)
- **Guides**:
  - `new-project.md`: Setting up Drizzle in new projects
  - `existing-project.md`: Integrating Drizzle into existing codebases
  - `schema-only.md`: Schema-first workflow without migrations
  - `troubleshooting.md`: Common issues and solutions
- **References**:
  - `adapters.md`: HTTP vs WebSocket adapter selection
  - `migrations.md`: Migration strategies and patterns
  - `query-patterns.md`: Common query patterns and best practices

#### Neon Serverless Skill
- **Purpose**: Serverless database connection configuration
- **Scripts**: `validate-connection.ts`
- **Templates**: HTTP connection, WebSocket pool

#### Neon Toolkit Skill
- **Purpose**: Ephemeral database creation for testing and CI/CD workflows
- **Scripts**: `create-ephemeral-db.ts`, `destroy-ephemeral-db.ts`
- **Templates**: Toolkit workflow

#### Add Neon Docs Skill
- **Purpose**: Install Neon documentation references in project AI configuration files
- **Workflow**: `install-knowledge.md` with step-by-step reference installation process
- **Metadata**: `skill-knowledge-map.json` defining available documentation references
- **Target Files**: CLAUDE.md, AGENTS.md, or Cursor rules files

## Key Patterns & Conventions

### .mdc File Format
- Each .mdc file uses Markdown with practical code examples
- Files follow a consistent structure: Overview → Use Cases → Examples → Best Practices
- Files are tool-agnostic and can be used in multiple AI environments

### Skill Organization
- Skills are self-contained workflows with guided steps
- Templates are production-ready examples
- Scripts provide automation and validation

### Plugin Metadata
- Version follows semantic versioning
- Plugin description clearly indicates purpose and scope
- MCP configuration uses remote URL for centralized updates

## Usage Context

### For Claude Code Users
- Activate the plugin in Claude Code
- Use skills for guided workflows
- MCP server provides real-time Neon resource management

### For Other AI Tools
- Copy .mdc files to tool-specific rule directories
- Files work with Cursor, custom ChatGPT instances, etc.
- Each file is self-contained and doesn't require dependencies

### For Contributors
- Add new .mdc files for new technologies or patterns
- Update skills with new templates or scripts
- Keep plugin.json version in sync with major updates

## Recent Changes & Decisions

### Neon Drizzle Workflow Improvements (October 2025)
- Added migration scripts section to both `new-project.md` and `existing-project.md` guides
- Enhanced workflow completion with better user feedback in `existing-project.md`
- Provides standard `db:*` npm scripts for common Drizzle operations (generate, migrate, push, studio)

### Dev Marketplace Integration (Latest)
- Added complete `dev-marketplace/` structure for Claude Code plugin ecosystem
- Implemented 4 guided skills:
  - **neon-drizzle**: Drizzle ORM integration with comprehensive workflow guides
  - **neon-serverless**: Serverless connection configuration
  - **neon-toolkit**: Ephemeral database management
  - **add-neon-docs**: Documentation reference installer
- Enhanced Drizzle skill with comprehensive guides and references for different workflows
- Configured MCP server integration for resource management
- Updated README to document plugin and skills

### Neon Drizzle Skill Enhancement
- Expanded skill structure with `guides/` and `references/` directories
- Added workflow-specific guides for new projects, existing projects, and schema-only approaches
- Included technical references for adapters, migrations, and query patterns
- Provides comprehensive support for different Drizzle integration scenarios

### API Rules Addition (Previous)
- Added 7 comprehensive API rule files
- Organized API rules by resource type (projects, branches, endpoints, etc.)
- Provides patterns for REST API usage

### SDK Rules Addition
- Added TypeScript and Python SDK rule files
- Guides for programmatic database management

## Important Notes for Future Work

1. **Keep .mdc files separate**: Each .mdc file should remain independent and not reference others
2. **Plugin versioning**: Update plugin.json version when adding new skills
3. **MCP server**: The remote MCP server URL should be kept current (https://mcp.neon.tech/mcp)
4. **Template testing**: Test new skill templates in real Claude Code environments before committing
5. **Documentation sync**: Update README.md and CLAUDE.md when adding new rules or skills

## Technology Stack

- **Language**: Markdown (for .mdc files), TypeScript (for scripts and templates)
- **Runtimes**: Node.js (for scripts), Shell (for setup)
- **Tools**: Claude Code, Cursor, custom AI environments
- **Integration**: MCP (Model Context Protocol) for resource management

## Resources & References

### Claude Code Documentation
- **Skills**: https://docs.claude.com/en/docs/claude-code/skills
- **Plugins**: https://docs.claude.com/en/docs/claude-code/plugins
- **Subagents**: https://docs.claude.com/en/docs/claude-code/sub-agents
- **Skills Examples**: https://github.com/anthropics/skills
- **Skills Best Practices**: https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices

These resources provide comprehensive guidance for:
- Building new skills for Claude Code
- Creating and distributing plugins
- Understanding skill structure, templates, and scripts
- Plugin configuration and marketplace integration
