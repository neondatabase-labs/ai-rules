---
name: neon-drizzle
description: Use this skill to set up and integrate Drizzle ORM with Neon. This skill installs packages and modifies code.
allowed-tools: ["bash", "write", "read_file"]
---

# Neon Drizzle Integration

## What's Your Starting Point?

Choose your path - I'll load the appropriate complete walkthrough:

1. **New Project Setup** → Fresh Drizzle + Neon installation (complete guide: `guides/new-project.md`)
2. **Existing Project** → Add Drizzle to running app (complete guide: `guides/existing-project.md`)
3. **Schema Changes** → Create/modify database schema (complete guide: `guides/schema-only.md`)
4. **Migration Issues** → Debug failed migrations (reference guide: `guides/troubleshooting.md`)

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

## How the Skill Works

Each guide follows a structured approach:

- **Auto-detect your environment** (package manager, framework, existing setup)
- **Install the right dependencies** for your specific deployment target
- **Configure with best practices** (proper env loading, correct adapters)
- **Set up or modify schemas** based on your application needs
- **Run migrations safely** with comprehensive error handling
- **Verify everything works** before you move forward
- **Add reference documentation** to your project's AI knowledge base

### Decision Tree

```
User Request
  ↓
Auto-Detect (package manager, framework, existing config)
  ↓
Classify Intent
  ├─ "setup", "new" → Load guides/new-project.md (complete walkthrough)
  ├─ "add", "existing" → Load guides/existing-project.md (complete walkthrough)
  ├─ "schema", "create table" → Load guides/schema-only.md (complete walkthrough)
  └─ "error", "failed", "fix" → Load guides/troubleshooting.md (reference guide)
  ↓
Execute Guide Workflow
  ↓
Load References On-Demand (adapters.md, migrations.md, query-patterns.md)
  ↓
Verify & Report
```

## Available Resources

### Guides (Complete Walkthroughs)
Each guide is a self-contained, step-by-step walkthrough with its own numbered phases:
- `guides/new-project.md` - Complete walkthrough: Full setup from scratch
- `guides/existing-project.md` - Complete walkthrough: Add to existing application
- `guides/schema-only.md` - Complete walkthrough: Schema creation and modification
- `guides/troubleshooting.md` - Reference guide: Debug common issues (organized by error type)

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

---

## Workflow Complete

✅ **Drizzle setup is complete and ready to use!**

Your Drizzle + Neon integration is fully functional. You can now start building queries and managing your database schema.
