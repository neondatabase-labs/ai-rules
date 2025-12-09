---
name: neon-js
description: Sets up the full Neon JS SDK with unified auth and PostgREST-style database queries. Configures auth client, data client, and type generation. Use when building apps that need both authentication and database access in one SDK.
allowed-tools: ["bash", "write", "read_file"]
---

# Neon JS SDK Integration

Set up the unified Neon JS SDK for authentication and database queries in one package.

## When to Use This Skill

- Building apps that need both auth and database queries
- Migrating from Supabase to Neon
- Using PostgREST-style API for database access
- Need type-safe database queries with generated types

**Package**: `@neondatabase/neon-js` (full SDK with auth + data API)

**Need auth only?** Use the `neon-auth` skill instead for `@neondatabase/auth` with a smaller bundle.

## Code Generation Rules

When generating TypeScript/JavaScript code:

### Import Path Handling
- BEFORE generating import statements, check tsconfig.json for path aliases (compilerOptions.paths)
- If path aliases exist (e.g., "@/*": ["./src/*"]), use them (e.g., `import { x } from '@/lib/db'`)
- If NO path aliases exist or unsure, ALWAYS use relative imports (e.g., `import { x } from '../lib/db'`)
- Default to relative imports - they always work regardless of configuration

### Critical: Neon JS Package Imports
- BetterAuthReactAdapter MUST be imported from subpath:
  ```typescript
  // Correct
  import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

  // Wrong - will not work
  import { BetterAuthReactAdapter } from "@neondatabase/neon-js";
  ```
- Adapters are factory functions - call them:
  ```typescript
  // Correct
  adapter: BetterAuthReactAdapter()

  // Wrong
  adapter: BetterAuthReactAdapter
  ```
- Main client import:
  ```typescript
  import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";
  ```

### CSS Import Strategy
- Check for tailwind.config.{js,ts} before generating CSS imports
- If Tailwind detected: use `@import '@neondatabase/neon-js/ui/tailwind'` in CSS file
- If no Tailwind: use `import "@neondatabase/neon-js/ui/css"` in layout/app file
- NEVER import both (causes 94KB of duplicate styles)

## Available Guides

Each guide is a complete, self-contained walkthrough with numbered phases:

- **`guides/nextjs-full-stack.md`** - Next.js App Router with auth + data API

I'll automatically detect your context (package manager, framework, existing setup) and select the appropriate guide based on your request.

For troubleshooting, see the [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) in references.

## Quick Examples

Tell me what you're building - I'll handle the rest:

- "Set up Neon JS for my Next.js app" -> Loads full stack guide, configures auth + data
- "Add database queries to my auth setup" -> Configures data API client
- "Migrate from Supabase" -> Uses SupabaseAuthAdapter for compatibility

## Reference Documentation

**Primary Resource:** See [neon-js.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-js.mdc) for comprehensive guidelines including:
- Client setup for all frameworks
- Database query patterns (PostgREST syntax)
- Auth adapter options (BetterAuth, Supabase)
- Type generation
- Error handling

**Auth Details:** See [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) for:
- All authentication methods
- UI components
- Database user sync patterns

**Technical References:**
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns, CSS
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions
- [Auth Adapters Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-adapters.md) - Adapter comparison
- [Import Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-imports.md) - Complete import paths

## Templates

- `templates/full-client.ts` - Unified auth + data client configuration

## Related Skills

- **neon-auth** - Auth only (smaller bundle, no data queries)
- **neon-drizzle** - Drizzle ORM setup (alternative to PostgREST)
- **neon-serverless** - Direct database connections
- **add-neon-docs** - Add Neon best practices to your project (run after setup)

---

## Workflow

I will:
1. Detect your project context automatically (Next.js, React SPA, Node.js)
2. Select and load the appropriate guide
3. Follow the guide's phases sequentially
4. Track progress using the guide's workflow checklist
5. Load reference files only when needed
6. Offer to add Neon best practices to your project docs

Ready to get started? Just describe what you're building!
