# Neon Drizzle Skill Improvement Plan

## Overview

This plan restructures the neon-drizzle skill to follow best practices from anthropics/skills repository, focusing on:
- Clear decision tree with progressive disclosure
- Phase-based workflow
- Lazy loading of context via file splitting
- Minimal redundancy

## Current State Analysis

### Problems Identified

1. **Monolithic File (492 lines)**
   - Everything loads into context immediately
   - No progressive disclosure based on user needs
   - Heavy context pollution before execution begins

2. **Unclear Decision Logic**
   - Mixes "What I can detect" with "What I'll do"
   - User must read through everything to understand their path
   - No clear entry points for different scenarios

3. **Repetitive Content**
   - Environment loading explained 3+ times (lines 146, 158, 274)
   - Adapter selection repeated across multiple sections
   - Same troubleshooting advice in multiple places

4. **Poor Template Organization**
   - Large code blocks inline (lines 142-157, 162-180)
   - Templates referenced but not utilized effectively
   - Scripts exist but not integrated into workflow

5. **Mixed Concerns**
   - Setup instructions mixed with query patterns
   - Troubleshooting scattered throughout
   - Examples not clearly separated from instructions

### What's Working Well

✅ **Allowed Tools** - Correctly specified: bash, write, read_file
✅ **Templates Directory** - Good examples exist (schema-example.ts, drizzle-config.ts)
✅ **Scripts Directory** - Helper scripts for generation and migration
✅ **Auto-detection Goals** - Right approach, just poorly organized

## Target State

### New File Structure

```
neon-drizzle/
├── SKILL.md                          # Main entry point (150 lines max)
│   ├── Decision tree (What's your starting point?)
│   ├── Phase overview
│   └── When to use this skill
│
├── guides/                           # Lazy-loaded workflow guides
│   ├── new-project.md               # Full setup from scratch
│   ├── existing-project.md          # Add Drizzle to existing app
│   ├── schema-only.md               # Just create/modify schemas
│   └── troubleshooting.md           # Debug common issues
│
├── references/                       # Context loaded on-demand
│   ├── adapters.md                  # HTTP vs WebSocket decision
│   ├── migrations.md                # Migration patterns & errors
│   └── query-patterns.md            # Example queries
│
├── templates/                        # Keep existing
│   ├── schema-example.ts
│   ├── drizzle-config.ts
│   ├── db-http.ts                   # NEW: HTTP adapter template
│   └── db-websocket.ts              # NEW: WebSocket adapter template
│
└── scripts/                          # Keep existing
    ├── generate-schema.ts
    └── run-migration.ts
```

## Implementation Approach

### Phase 1: Restructure Main SKILL.md

**Goal**: Create a clean entry point with clear decision tree (150 lines max)

#### New Structure:

```markdown
---
name: neon-drizzle
description: Set up and integrate Drizzle ORM with Neon Postgres databases
allowed-tools: ["bash", "write", "read_file"]
---

# Neon Drizzle Integration

## What's Your Starting Point?

Choose your path - I'll load the right guide:

1. **New Project Setup** → Fresh Drizzle + Neon installation
2. **Existing Project** → Add Drizzle to running app
3. **Schema Changes** → Create/modify database schema
4. **Migration Issues** → Debug failed migrations
5. **Performance** → Optimize queries

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

[Continue with condensed sections...]
```

**Changes from Current:**
- Remove inline code examples (reference files instead)
- Remove redundant explanations
- Use table format for pattern recognition
- Keep decision tree at top
- Reference guides/* for detailed workflows

### Phase 2: Create Workflow Guides

#### 2.1. New Project Guide (guides/new-project.md)

**Content:**
- Phase 1: Detect Context (auto-detection logic)
- Phase 2: Install Dependencies (based on detection)
- Phase 3: Configure Connection (HTTP vs WebSocket)
- Phase 4: Generate Schema
- Phase 5: Run Migrations
- Phase 6: Verify Setup

**Why Separate:**
- Only loads for users starting from scratch
- Can include detailed explanations without polluting main context
- Allows iteration on workflow without touching main file

#### 2.2. Existing Project Guide (guides/existing-project.md)

**Content:**
- Check for conflicts (other ORMs)
- Incremental installation
- Migrate existing database schema
- Coexistence patterns

**Why Separate:**
- Different user journey than new project
- Specific edge cases not relevant to new setups

#### 2.3. Schema-Only Guide (guides/schema-only.md)

**Content:**
- Schema design patterns
- Relations and indexes
- Generate migrations
- Apply changes

**Why Separate:**
- Users who know Drizzle but need schema help
- Can reference template files heavily
- Minimal setup/install noise

#### 2.4. Troubleshooting Guide (guides/troubleshooting.md)

**Content:**
- Common errors (url: undefined, migration conflicts)
- Adapter mismatch
- Environment loading issues
- Connection debugging

**Why Separate:**
- Only loads when user has problems
- Can be comprehensive without cluttering happy path
- Easier to maintain error catalog

### Phase 3: Create Reference Documents

#### 3.1. Adapter Reference (references/adapters.md)

**Content:**
- Decision matrix (when to use HTTP vs WebSocket)
- Environment-specific patterns
- Connection configuration examples
- Performance implications

**Why Separate:**
- Technical reference, not workflow
- Loads only when user needs adapter decision
- Can include benchmarks and advanced topics

#### 3.2. Migration Reference (references/migrations.md)

**Content:**
- Migration lifecycle
- Generation commands
- Application patterns
- Rollback strategies
- Environment loading deep-dive

**Why Separate:**
- Advanced topic for users with migration questions
- Prevents environment loading repetition in main file

#### 3.3. Query Patterns Reference (references/query-patterns.md)

**Content:**
- CRUD operations
- Joins and relations
- Transactions
- Advanced filtering
- Performance tips

**Why Separate:**
- Post-setup reference
- Users working with existing Drizzle installation
- Can be comprehensive without affecting setup flow

### Phase 4: Create New Templates

#### 4.1. HTTP Adapter Template (templates/db-http.ts)

Extract from current SKILL.md lines 162-169 into dedicated file.

**Why:**
- Referenced instead of inline
- Can include comments and best practices
- Easier to maintain

#### 4.2. WebSocket Adapter Template (templates/db-websocket.ts)

Extract from current SKILL.md lines 172-180 into dedicated file.

**Why:**
- Same benefits as HTTP template
- Clear separation of concerns

### Phase 5: Update Scripts

#### 5.1. Enhance generate-schema.ts

**Additions:**
- Better error messages referencing guides/troubleshooting.md
- Auto-detect if env loading issue
- Suggest next steps based on success/failure

#### 5.2. Enhance run-migration.ts

**Additions:**
- Pre-flight checks (env vars, file paths)
- Post-migration verification
- Reference troubleshooting on failure

## Decision Tree Logic

### New Top-Level Decision Flow

```
User Activates Skill
  ↓
Auto-Detect Project Context
  ├─ Read package.json
  ├─ Check lockfiles
  ├─ Look for drizzle.config.ts
  └─ Scan for .env files
  ↓
Classify User Intent (from request)
  ├─ Keywords: "setup", "new" → Load guides/new-project.md
  ├─ Keywords: "add", "existing" → Load guides/existing-project.md
  ├─ Keywords: "schema", "create table" → Load guides/schema-only.md
  ├─ Keywords: "error", "failed", "fix" → Load guides/troubleshooting.md
  └─ Ambiguous → Ask ONE question: "Starting fresh or adding to existing project?"
  ↓
Load Appropriate Guide
  ↓
Execute Workflow
  ├─ Load references/* only when needed
  ├─ Load templates/* only when creating files
  └─ Reference scripts/* with clear execution instructions
  ↓
Verify & Report
```

### Phase-Based Execution Within Guides

Each guide follows this pattern:

```markdown
# [Guide Name]

## Phase 1: Context Detection
[Auto-detection steps]

## Phase 2: [Core Action]
[Main workflow]
- Load references/[relevant].md if user needs background
- Reference templates/[file].ts when creating files

## Phase 3: Verification
[Test steps]

## Phase 4: Next Steps
[What to do after success]
```

## Lazy Loading Strategy

### Context Loading Rules

**Always Loaded:**
- SKILL.md (main file, ~150 lines)

**Load on Path Detection:**
- ONE guide from guides/* based on user intent

**Load on Demand:**
- references/* only when:
  - User asks question about concept
  - Error occurs requiring explanation
  - Advanced pattern needed

**Load on Action:**
- templates/* only when:
  - Actually creating that file
  - User asks to see example

### Estimated Context Savings

**Current State:**
- Single file: 492 lines (~3,500 tokens)
- All content loads immediately

**New State:**
- Main file: 150 lines (~1,000 tokens)
- Average guide: 100 lines (~700 tokens)
- Average reference: 80 lines (~550 tokens)

**Typical User Journey:**
1. Load SKILL.md: 1,000 tokens
2. Load one guide: 700 tokens
3. Load 0-2 references: 0-1,100 tokens

**Total: 1,700-2,800 tokens** (vs. 3,500 tokens for everything)

**Savings: 20-50% context reduction** with better organization

## Success Criteria

### Automated Verification

After restructuring:

1. **File Count Check:**
   ```bash
   # Should have these files
   ls neon-drizzle/SKILL.md
   ls neon-drizzle/guides/{new-project,existing-project,schema-only,troubleshooting}.md
   ls neon-drizzle/references/{adapters,migrations,query-patterns}.md
   ls neon-drizzle/templates/{db-http,db-websocket}.ts
   ```

2. **Line Count Check:**
   ```bash
   wc -l neon-drizzle/SKILL.md  # Should be < 200 lines
   ```

3. **Content Validation:**
   - SKILL.md contains decision tree
   - No code examples > 10 lines in SKILL.md
   - Each guide is self-contained
   - No duplicate content across files

### Manual Verification

1. **User Experience Test:**
   - New project setup: Does user need to read only SKILL.md + guides/new-project.md?
   - Troubleshooting: Can user go directly to guides/troubleshooting.md?
   - Schema creation: Is guides/schema-only.md sufficient?

2. **Context Efficiency Test:**
   - Measure tokens loaded for typical user journeys
   - Verify no redundant loading
   - Check that references load only when needed

3. **Clarity Test:**
   - Can user determine their path in < 30 seconds?
   - Is decision tree obvious?
   - Are phase names clear?

## Migration Strategy

### Step-by-Step Execution

1. **Backup Current State**
   ```bash
   cp -r neon-drizzle neon-drizzle.backup
   ```

2. **Create New Directory Structure**
   ```bash
   mkdir -p neon-drizzle/guides
   mkdir -p neon-drizzle/references
   ```

3. **Extract Content from SKILL.md**
   - Lines 88-280 → guides/new-project.md
   - Lines 281-320 → guides/schema-only.md
   - Lines 321-405 → references/migrations.md
   - Lines 327-372 → references/query-patterns.md
   - Lines 407-421 → guides/troubleshooting.md

4. **Create New Templates**
   - Extract HTTP adapter code → templates/db-http.ts
   - Extract WebSocket adapter code → templates/db-websocket.ts

5. **Rewrite SKILL.md**
   - Create new structure (see Phase 1)
   - Add decision tree
   - Reference guides instead of inline content

6. **Create guides/existing-project.md**
   - New content (doesn't exist currently)
   - Focus on incremental addition

7. **Create references/adapters.md**
   - Consolidate adapter explanations
   - Add decision matrix

8. **Update Scripts**
   - Enhance error messages
   - Add references to guides

9. **Validate**
   - Check all links between files
   - Verify no broken references
   - Test typical user flows

### Rollback Plan

If issues arise:
```bash
rm -rf neon-drizzle
mv neon-drizzle.backup neon-drizzle
```

Keep backup until new structure is validated by users.

## Open Questions & Decisions

### Resolved

✅ **File format**: Markdown for all guides (consistent with SKILL.md)
✅ **Loading mechanism**: Claude Code auto-loads referenced files when mentioned
✅ **Template format**: Keep as .ts files (they're templates, not guides)

### To Decide During Implementation

1. **Guide naming convention**:
   - Option A: `new-project.md` (lowercase-hyphen)
   - Option B: `NewProject.md` (PascalCase)
   - **Decision**: Use lowercase-hyphen (matches SKILL.md pattern)

2. **Cross-references**:
   - How to reference between files?
   - Use relative paths: `guides/new-project.md`
   - Or just file names: `new-project.md`?
   - **Decision**: Use relative paths from skill root for clarity

3. **Template variables**:
   - Should templates have placeholder comments?
   - Or be production-ready?
   - **Decision**: Production-ready with minimal comments (matches current approach)

## Performance Considerations

### Context Window Management

**Before:**
- Single 492-line file
- All examples and troubleshooting loaded
- ~3,500 tokens baseline

**After:**
- Modular loading
- Typical journey: ~1,700-2,800 tokens
- Complex journey (with references): ~2,800-3,500 tokens

**Benefit:**
- Happy path users save 20-50% context
- Complex scenarios use same as before (no worse)
- Users can request specific references

### Load Time

No impact - all files are local, loaded by Claude Code instantly.

### Maintenance Velocity

**Improved:**
- Changes to troubleshooting don't affect main workflow
- Can update guides independently
- Easier to add new patterns without restructuring

## References

### Source Files Analyzed

- Current: `dev-marketplace/neon-plugin/skills/neon-drizzle/SKILL.md`
- Example skills:
  - `anthropics/skills/webapp-testing/SKILL.md`
  - `anthropics/skills/mcp-builder/SKILL.md`

### Related Documentation

- Claude Code Skills: https://docs.claude.com/en/docs/claude-code/skills
- Neon Drizzle Integration: `neon-drizzle.mdc`

---

## Next Steps

After plan approval:

1. Execute Phase 1 (Main SKILL.md restructure)
2. Execute Phase 2 (Create workflow guides)
3. Execute Phase 3 (Create references)
4. Execute Phase 4 (New templates)
5. Execute Phase 5 (Update scripts)
6. Run success criteria checks
7. User testing with sample scenarios
8. Iterate based on feedback

**Estimated Implementation Time:** 2-3 hours

**Risk Level:** Low (can rollback easily, backup exists)

**Impact:** High (significantly improves user experience and context efficiency)
