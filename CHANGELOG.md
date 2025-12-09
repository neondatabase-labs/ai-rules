# Changelog

All notable changes to the Neon Claude Code Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-09

### Added
- **neon-auth** skill for Neon Auth integration with `@neondatabase/auth`
  - Next.js setup guide with full workflow
  - Troubleshooting guide for common auth issues
  - Templates: API route handler, auth client
  - Validation script for setup verification
- **neon-js** skill for full Neon JS SDK with `@neondatabase/neon-js`
  - Next.js full-stack guide with auth + data API
  - Troubleshooting guide for SDK issues
  - Template: unified client configuration
  - Validation script for setup verification
- Added neon-js entry to skill-knowledge-map.json

### Changed
- Updated cross-references in existing skills to include neon-auth

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
