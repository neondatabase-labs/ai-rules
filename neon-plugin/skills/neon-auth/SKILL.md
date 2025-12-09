---
name: neon-auth
description: Sets up Neon Auth with automatic user sync to your database. Configures Stack Auth integration, creates auth routes, and generates UI components. Use when adding authentication to Next.js, React SPA, or Node.js projects.
allowed-tools: ["bash", "write", "read_file"]
---

# Neon Auth Integration

Add authentication to your application with automatic user data synchronization to your Neon database.

## When to Use This Skill

- Adding authentication to a new or existing project
- Setting up Stack Auth with Neon database integration
- Implementing sign-in, sign-up, and session management
- Syncing authenticated users to your database automatically

**Package**: `@neondatabase/auth` (auth only, smaller bundle)

**Need database queries too?** Use the `neon-js` skill instead for `@neondatabase/neon-js` with unified auth + data API.

## Code Generation Rules

When generating TypeScript/JavaScript code:

### Import Path Handling
- BEFORE generating import statements, check tsconfig.json for path aliases (compilerOptions.paths)
- If path aliases exist (e.g., "@/*": ["./src/*"]), use them (e.g., `import { x } from '@/lib/auth'`)
- If NO path aliases exist or unsure, ALWAYS use relative imports (e.g., `import { x } from '../lib/auth'`)
- Default to relative imports - they always work regardless of configuration

### Critical: Neon Auth Package Imports
- BetterAuthReactAdapter MUST be imported from subpath:
  ```typescript
  // Correct
  import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

  // Wrong - will not work
  import { BetterAuthReactAdapter } from "@neondatabase/auth";
  ```
- Adapters are factory functions - call them:
  ```typescript
  // Correct
  adapter: BetterAuthReactAdapter()

  // Wrong
  adapter: BetterAuthReactAdapter
  ```

### CSS Import Strategy
- Check for tailwind.config.{js,ts} before generating CSS imports
- If Tailwind detected: use `@import '@neondatabase/auth/ui/tailwind'` in CSS file
- If no Tailwind: use `import "@neondatabase/auth/ui/css"` in layout/app file
- NEVER import both (causes 94KB of duplicate styles)

## Available Guides

Each guide is a complete, self-contained walkthrough with numbered phases:

- **`guides/nextjs-setup.md`** - Next.js App Router with auth routes and UI components

I'll automatically detect your context (package manager, framework, existing setup) and select the appropriate guide based on your request.

For troubleshooting, see the [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) in references.

## Quick Examples

Tell me what you're building - I'll handle the rest:

- "Add authentication to my Next.js app" -> Loads Next.js guide, sets up auth routes
- "Set up sign-in with Google" -> Configures social auth provider
- "Debug my auth session not persisting" -> Loads troubleshooting guide

## Reference Documentation

**Primary Resource:** See [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) for comprehensive guidelines including:
- All authentication methods (email/password, social, magic link)
- Session data structure
- UI components reference
- Database user sync patterns
- Error handling

**Technical References:**
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns, CSS
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions
- [Auth Adapters Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-adapters.md) - Adapter comparison
- [Import Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-imports.md) - Complete import paths

## Templates

- `templates/nextjs-api-route.ts` - API route handler for Next.js
- `templates/auth-client.ts` - Client-side auth configuration

## Related Skills

- **neon-js** - Full SDK with auth + database queries (use if you need PostgREST-style data access)
- **neon-drizzle** - Drizzle ORM setup (integrates with auth via users_sync table)
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
