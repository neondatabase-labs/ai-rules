---
name: neon-auth
description: Sets up Neon Auth for your application. Configures authentication, creates auth routes, and generates UI components. Use when adding authentication to Next.js, React SPA, or Node.js projects.
allowed-tools: ["bash", "write", "read_file"]
---

# Neon Auth Integration

Add authentication to your application.

## When to Use This Skill

- Adding authentication to a new or existing project
- Implementing sign-in, sign-up, and session management
- Configuring social authentication (Google, GitHub)

**Package**: `@neondatabase/auth` (auth only, smaller bundle)

**Need database queries too?** Use the `neon-js` skill instead for `@neondatabase/neon-js` with unified auth + data API.

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

- **`guides/nextjs-setup.md`** - Complete Next.js App Router setup guide
- **`guides/react-spa-setup.md`** - Detailed React SPA guide with react-router-dom integration

I'll automatically detect your context (package manager, framework, existing setup) and select the appropriate guide based on your request.

For troubleshooting, see the [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) in references.

## Quick Examples

Tell me what you're building - I'll handle the rest:

- "Add authentication to my Next.js app" -> Loads setup guide, sets up auth routes
- "Set up sign-in with Google" -> Configures social auth provider
- "Debug my auth session not persisting" -> Loads troubleshooting guide

## Reference Documentation

**Primary Resource:** See [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) for comprehensive guidelines including:
- All authentication methods (email/password, social, magic link)
- Session data structure
- UI components reference
- Error handling

**Framework-Specific Setup (choose your framework):**
- [Setup - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md)
- [Setup - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-react-spa.md)
- [Setup - Node.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nodejs.md)

**Framework-Specific UI (choose your framework):**
- [UI - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-nextjs.md)
- [UI - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-react-spa.md)

**Shared References:**
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns, CSS
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions
- [Code Generation Rules](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/code-generation-rules.md) - Import and CSS strategies
- [Auth Adapters Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-adapters.md) - Adapter comparison
- [Import Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-imports.md) - Complete import paths

## Templates

- `templates/nextjs-api-route.ts` - API route handler for Next.js
- `templates/auth-client.ts` - Client-side auth configuration

## Related Skills

- **neon-js** - Full SDK with auth + database queries (use if you need PostgREST-style data access)
- **neon-drizzle** - Drizzle ORM setup (for database queries)
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
