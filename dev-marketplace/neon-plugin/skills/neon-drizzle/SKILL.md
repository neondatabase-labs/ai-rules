---
name: neon-drizzle
description: Set up and integrate Drizzle ORM with Neon Postgres databases
allowed-tools: ["bash", "write", "read_file"]
---

# Neon Drizzle Integration

## What's Your Starting Point?

Choose your path - I'll load the right guide:

1. **New Project Setup** → Fresh Drizzle + Neon installation (see `guides/new-project.md`)
2. **Existing Project** → Add Drizzle to running app (see `guides/existing-project.md`)
3. **Schema Changes** → Create/modify database schema (see `guides/schema-only.md`)
4. **Migration Issues** → Debug failed migrations (see `guides/troubleshooting.md`)

## How I Work

**Auto-Detection First:**
- ✅ Package manager (lockfiles)
- ✅ Framework (package.json)
- ✅ Existing Drizzle setup
- ✅ Deployment target (for most cases)

**I Ask When Needed:**
- ❓ Deployment target (only for ambiguous cases)
- ❓ Schema requirements (only if you don't specify)

## Quick Start Patterns

I recognize these and act immediately:

| You Say | I Auto-Detect | I Do |
|---------|--------------|------|
| "Setup Drizzle for Next.js" | Next.js → Vercel | Install deps, HTTP adapter, basic schema |
| "Add Drizzle to Express" | Express → Node.js | WebSocket adapter, pooling |
| "Create blog schema" | App type: blog | Users + posts + comments tables |
| "Setup Drizzle for Vite on Vercel" | Vite + Vercel | HTTP adapter, API routes |

## When to Use This Skill

Use this skill when you want to:
- Set up Drizzle ORM in a new project with Neon
- Add Drizzle to an existing Neon project
- Create or modify database schemas
- Set up or run migrations
- Configure the right connection adapter (HTTP vs WebSocket)

## When NOT to Use This Skill

Skip this skill if:
- You need raw SQL queries only (use `neon-serverless` skill instead)
- You're working with complex stored procedures (limited Drizzle support)
- You need to reverse-engineer an existing database schema
- This is a one-off script (ORM overhead not worth it)

## Workflow Overview

### Phase-Based Execution

Each workflow follows this pattern:

1. **Context Detection** - Auto-detect package manager, framework, existing setup
2. **Installation** - Install correct dependencies based on environment
3. **Configuration** - Create config files with proper env loading
4. **Schema Setup** - Generate or modify schemas based on app type
5. **Migration** - Run migrations with proper error handling
6. **Verification** - Test setup and provide next steps

### Decision Tree

```
User Request
  ↓
Auto-Detect (package manager, framework, existing config)
  ↓
Classify Intent
  ├─ "setup", "new" → guides/new-project.md
  ├─ "add", "existing" → guides/existing-project.md
  ├─ "schema", "create table" → guides/schema-only.md
  └─ "error", "failed", "fix" → guides/troubleshooting.md
  ↓
Load Appropriate Guide
  ↓
Execute Workflow (with on-demand references)
  ↓
Verify & Report
```

## Available Resources

### Guides (Workflow-Specific)
- `guides/new-project.md` - Full setup from scratch
- `guides/existing-project.md` - Add to existing application
- `guides/schema-only.md` - Schema creation and modification
- `guides/troubleshooting.md` - Debug common issues

### References (Load on Demand)
- `references/adapters.md` - HTTP vs WebSocket decision guide
- `references/migrations.md` - Migration patterns and troubleshooting
- `references/query-patterns.md` - Example queries and best practices

### Templates
- `templates/schema-example.ts` - Multi-table schema with relations
- `templates/drizzle-config.ts` - Configuration examples
- `templates/db-http.ts` - HTTP adapter setup
- `templates/db-websocket.ts` - WebSocket adapter setup

### Scripts
- `scripts/generate-schema.ts` - Automated migration generation
- `scripts/run-migration.ts` - Programmatic migration runner

## Getting Started

Just tell me what you're building:

**Zero questions needed:**
- "Setup Drizzle with Neon for my React todo app on Vercel"
- "Add Drizzle to my Next.js project for a blog"

**One question needed:**
- "Setup Drizzle for my Vite app" → I'll ask about deployment
- "Add Drizzle to my React project" → I'll ask about environment

**Pro tip:** Include app type AND deployment in your first message for zero questions!

## Related Skills

- **neon-serverless** - Connection setup without ORM
- **neon-toolkit** - Ephemeral databases for testing

## Deep Reference

For comprehensive documentation: `neon-drizzle.mdc`
