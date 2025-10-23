---
name: neon-drizzle
description: Sets up Drizzle ORM with Neon for database management. Use when creating new projects with Drizzle, adding ORM to existing applications, or modifying database schemas.
allowed-tools: ["bash", "write", "read_file"]
---

# Neon Drizzle Integration

Comprehensive Drizzle ORM setup for Neon databases with guided workflows.

## When to Use This Skill

- Setting up Drizzle in a new project (Next.js, Vite, Express, etc.)
- Integrating Drizzle into an existing application
- Creating or modifying database schemas
- Troubleshooting migration issues

## Available Guides

Each guide is a complete, self-contained walkthrough with numbered phases:

- **`guides/new-project.md`** - Full setup from scratch (see: Table of Contents)
- **`guides/existing-project.md`** - Add Drizzle to running apps (see: Table of Contents)
- **`guides/schema-only.md`** - Schema creation and modification (see: Table of Contents)
- **`guides/troubleshooting.md`** - Debug common issues (organized by error type)

I'll automatically detect your context (package manager, framework, deployment target) and select the appropriate guide based on your request.

## Quick Examples

Tell me what you're building - I'll handle the rest:

- "Setup Drizzle for my Next.js blog on Vercel" → Auto-detects Vercel + Next.js → HTTP adapter
- "Add Drizzle to my Express API" → Auto-detects Node.js server → WebSocket adapter
- "Create a users table with auth fields" → Loads schema guide → Generates schema

## Reference Documentation

For deeper technical details (loaded on-demand):

- `references/adapters.md` - HTTP vs WebSocket decision guide
- `references/migrations.md` - Migration patterns and troubleshooting
- `references/query-patterns.md` - Example queries and best practices

## Templates & Scripts

- `templates/schema-example.ts` - Multi-table schema with relations
- `templates/drizzle-config.ts` - Configuration examples
- `scripts/generate-schema.ts` - Automated migration generation
- `scripts/run-migration.ts` - Programmatic migration runner

## Related Skills

- **neon-serverless** - Connection setup without ORM
- **neon-toolkit** - Ephemeral databases for testing
- **add-neon-docs** - Add Neon best practices to your project (run after setup)

---

## Workflow

I will:
1. Detect your project context automatically
2. Select and load the appropriate guide
3. Follow the guide's phases sequentially
4. Track progress using the guide's workflow checklist
5. Load reference files only when needed
6. Offer to add Neon best practices to your project docs

Ready to get started? Just describe what you're building!
