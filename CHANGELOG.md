# Changelog

All notable changes to the Neon Claude Code Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-09

### Added
- **neon-auth** skill for Neon Auth integration with `@neondatabase/auth`
  - Next.js App Router setup guide
  - React SPA setup guide
  - Templates: API route handler, auth client
- **neon-js** skill for full Neon JS SDK with `@neondatabase/neon-js`
  - Setup guide with auth + data API integration
  - Template: unified client configuration
- New context rules:
  - `neon-auth.mdc` - Neon Auth integration patterns
  - `neon-js.mdc` - Neon JS SDK patterns
  - `neon-get-started.mdc` - Interactive onboarding guide
  - `neon-get-started-kiro.mdc` - Kiro-specific onboarding
- Shared `references/` directory with technical documentation
- `mcp-prompts/` directory for MCP prompt templates
- Added neon-auth and neon-js entries to skill-knowledge-map.json

### Changed
- Updated cross-references in existing skills to include neon-auth
- Removed users_sync table references from auth documentation (deprecated feature)
- Consolidated duplicate content into single source of truth

## [1.0.1] - 2025-10-29

- Added evals to the `neon-drizzle` and `add-neon-docs` skills
- Fixed `add-neon-docs` skill description, so it is picked properly
- Added explicit rules so that `add-neon-docs` skill doesn't edit unwanted files


## [1.0.0] - 2025-10-23

### Added
- Initial public release
- **neon-drizzle** skill with comprehensive guides (new projects, existing projects, schema-only)
- **neon-serverless** skill for connection configuration
- **neon-toolkit** skill for ephemeral database management
- **add-neon-docs** skill for documentation reference installation
- MCP server integration for resource management
- 13 context rules (.mdc files) covering:
  - Core integrations (auth, serverless, drizzle, toolkit)
  - SDKs (TypeScript, Python)
  - API guidelines (projects, branches, endpoints, organizations, keys, operations)
- Templates and scripts for all skills
- Comprehensive technical references for Drizzle (adapters, migrations, query patterns)

### Documentation
- Complete README with installation instructions
- Individual SKILL.md files for each skill
- Step-by-step workflow guides
- Technical reference documentation

[1.0.0]: https://github.com/neondatabase-labs/ai-rules/releases/tag/v1.0.0
