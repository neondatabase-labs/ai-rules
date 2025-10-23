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

## EXECUTION STEPS

**YOU MUST FOLLOW THESE STEPS IN ORDER. DO NOT SKIP OR REORDER.**

### STEP 1: LOAD THE GUIDE (REQUIRED)

Before doing ANYTHING else, you MUST read the appropriate guide file based on user intent:

**Intent Classification → Guide File Mapping:**
- "setup", "new", "initialize", "start fresh" → **READ** `guides/new-project.md`
- "add", "existing", "integrate", "current project" → **READ** `guides/existing-project.md`
- "schema", "create table", "modify schema", "update database" → **READ** `guides/schema-only.md`
- "error", "failed", "debug", "fix", "troubleshoot" → **READ** `guides/troubleshooting.md`

**CRITICAL:** Load the complete guide file before proceeding to Step 2.

### STEP 2: EXTRACT WORKFLOW CHECKLIST

After reading the guide:

1. **Find** the `## Workflow Checklist` section in the guide file
2. **Extract** the exact checklist items (the `- [ ] ...` lines)
3. **Use TodoWrite** to create todos from those EXACT items
4. **DO NOT** create your own checklist based on assumptions

**Example from guides/new-project.md:**
```
- [ ] Detect project context (package manager, framework, existing setup)
- [ ] Install Drizzle dependencies based on deployment target
- [ ] Create configuration files (env, drizzle config, db connection)
- [ ] Generate schema based on app type
- [ ] Run and verify migrations
- [ ] Add Neon Drizzle best practices to project docs
```

### STEP 3: FOLLOW THE GUIDE'S PHASES

Execute each numbered phase from the guide sequentially:

1. **Phase 1** → Mark first todo as `in_progress`
2. Complete Phase 1 → Mark todo as `completed`
3. **Phase 2** → Mark next todo as `in_progress`
4. Continue this pattern through all phases

**IMPORTANT:** The guide's phases map directly to the workflow checklist todos.

### STEP 4: LOAD REFERENCES ON-DEMAND

Only load reference files when:
- The guide explicitly references them (e.g., "see references/adapters.md")
- You encounter an issue that requires deeper technical knowledge
- User asks for more details on a specific topic

**Available References:**
- `references/adapters.md` - HTTP vs WebSocket decision guide
- `references/migrations.md` - Migration patterns and troubleshooting
- `references/query-patterns.md` - Example queries and best practices

---

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

Following the **EXECUTION STEPS** above, the skill provides a complete, guided workflow:

- **Auto-detect your environment** (package manager, framework, existing setup)
- **Install the right dependencies** for your specific deployment target
- **Configure with best practices** (proper env loading, correct adapters)
- **Set up or modify schemas** based on your application needs
- **Run migrations safely** with comprehensive error handling
- **Verify everything works** before you move forward
- **Add reference documentation** to your project's AI knowledge base

### Workflow Checklists

As described in **STEP 2** above, each complete walkthrough guide includes a **Workflow Checklist** section that:
- Provides high-level task tracking aligned with the guide's numbered phases
- Is extracted and converted to todos using TodoWrite (not created from scratch)
- Gives users clear visibility into what's being done and what's remaining
- Ensures the guide's workflow is followed exactly as designed

**Remember:** Always use the guide's checklist, not a custom one.

### Decision Tree

```
User Request
  ↓
Classify Intent
  ├─ "setup", "new" → STEP 1: READ guides/new-project.md
  ├─ "add", "existing" → STEP 1: READ guides/existing-project.md
  ├─ "schema", "create table" → STEP 1: READ guides/schema-only.md
  └─ "error", "failed", "fix" → STEP 1: READ guides/troubleshooting.md
  ↓
STEP 2: Extract Workflow Checklist from Guide
  ↓
STEP 2: Create Todos from Guide's Checklist (TodoWrite)
  ↓
STEP 3: Execute Guide's Numbered Phases
  ├─ Auto-detect context (package manager, framework, config)
  ├─ Install dependencies
  ├─ Create configuration files
  ├─ Generate/modify schema
  ├─ Run migrations
  └─ Verify & add docs
  ↓
STEP 4: Load References On-Demand (if needed)
  └─ adapters.md, migrations.md, query-patterns.md
  ↓
Complete & Report
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
