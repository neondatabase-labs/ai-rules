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

When generating TypeScript/JavaScript code, follow these rules:

**Complete reference:** See [Code Generation Rules](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/code-generation-rules.md) for:
- Import path handling (path aliases vs relative imports)
- Neon package imports (subpath exports, adapter patterns)
- CSS import strategy (Tailwind detection, single import method)
- File structure patterns

**Key points:**
- Check `tsconfig.json` for path aliases before generating imports
- Use relative imports if unsure or no aliases exist
- `BetterAuthReactAdapter` MUST be imported from `auth/react/adapters` subpath
- Adapters are factory functions - call them with `()`
- Choose ONE CSS import method (Tailwind or CSS, not both)

## Available Guides

Each guide is a complete, self-contained walkthrough with numbered phases:

- **`guides/setup.md`** - Complete setup guide for Next.js with auth + data API

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
- Session management

**Framework-Specific Setup (choose your framework):**
- [Setup - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md)
- [Setup - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-react-spa.md)
- [Setup - Node.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nodejs.md)

**Framework-Specific UI (choose your framework):**
- [UI - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-nextjs.md)
- [UI - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-react-spa.md)

**Data API & Shared References:**
- [Data API Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md) - PostgREST query patterns and examples
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns, CSS
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions
- [Code Generation Rules](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/code-generation-rules.md) - Import and CSS strategies
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
