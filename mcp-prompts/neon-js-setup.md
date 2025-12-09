# Neon JS SDK Setup (MCP Prompt Template)

> Interactive guide for setting up Neon JS SDK (auth + database queries). Supports Next.js, Vite/React, and Node.js.

## Communication Style

- **Be concise**: Report actions with checkmarks: "✓ Installed @neondatabase/neon-js"
- **Ask clearly**: "Which framework are you using?" instead of long explanations
- **Follow sequentially**: Complete one step before moving to the next
- **Allow pausing**: User can pause and resume anytime
- **Progressive disclosure**: Load detailed guides only when needed

---

## Step 1: Provision Neon Auth

Before starting, provision Neon Auth for the user's project.

**Check for provided context:**
- Project ID: (check if provided via MCP args)
- Branch ID: (optional, defaults to main branch)
- Database Name: (optional, defaults to neondb)

**If no project ID provided:**

1. Check the user's projects using `list_projects` tool

2. **If they have NO projects:**
   - Ask if they want to create one
   - Guide them to console.neon.tech or use `create_project` tool

3. **If they have 1 project:**
   - Ask: "Want to add Neon Auth to '{project_name}'?"

4. **If they have multiple projects:**
   - List project names and ask which one to use

**Once project is confirmed, provision Neon Auth:**

Use the `provision_neon_auth` tool with:
- `projectId`: The selected project ID
- `branchId`: (optional) defaults to main branch
- `databaseName`: (optional) defaults to neondb

**Save the `base_url` and `data_api_url` from the response** - you'll need them for Step 5.

---

## Step 2: Detect Project Context

Automatically detect the user's environment:

**Framework Detection:**
```bash
# Check for Next.js App Router
ls app/layout.tsx app/page.tsx

# Check for Vite/React
ls vite.config.ts src/main.tsx

# Check for Node.js backend
ls package.json | grep -E '(express|fastify|koa)'
```

**Existing Setup:**
```bash
# Check if already installed
grep '@neondatabase' package.json

# Check for existing setup
ls app/api/auth lib/db lib/auth 2>/dev/null
```

**Package Manager:**
```bash
# Detect from lock files
ls package-lock.json bun.lockb pnpm-lock.yaml yarn.lock
```

**Tailwind Detection:**
```bash
# Check for Tailwind config
ls tailwind.config.js tailwind.config.ts 2>/dev/null
```

---

## Step 3: Package Confirmation

This setup installs `@neondatabase/neon-js` which includes:
- ✅ Authentication (BetterAuth API)
- ✅ Data API (PostgREST-style queries)
- ✅ UI components (optional)

**If user only needs auth** (no database queries):
- Recommend switching to `@neondatabase/auth` (smaller bundle)
- Load auth-only template:
  - https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/mcp-prompts/neon-auth-setup.md

**Otherwise, continue with this guide.**

---

## Step 4: Install Dependencies

**Check package.json first**, then install:

```bash
npm install @neondatabase/neon-js
```

Replace `npm install` with your detected package manager (`pnpm add`, `yarn add`, `bun add`).

---

## Step 5: Configure Environment Variables

**Load setup reference for environment variables:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#environment-variables

**Quick reference:**

**For Next.js** - Create/update `.env.local`:
```bash
NEON_AUTH_BASE_URL=<base_url_from_step_1>
NEXT_PUBLIC_NEON_AUTH_URL=<base_url_from_step_1>
NEON_DATA_API_URL=<data_api_url_from_step_1>
```

**For Vite** - Create/update `.env`:
```bash
VITE_NEON_AUTH_URL=<base_url_from_step_1>
VITE_NEON_DATA_API_URL=<data_api_url_from_step_1>
```

**For Create React App** - Create/update `.env`:
```bash
REACT_APP_NEON_AUTH_URL=<base_url_from_step_1>
REACT_APP_NEON_DATA_API_URL=<data_api_url_from_step_1>
```

**Important:** Add `.env*` to `.gitignore` if not already present.

---

## Step 6: Create Client

**Load the comprehensive setup guide:**

### Next.js App Router

**Load guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-js/guides/setup.md

**Or load framework-specific sections:**
- Auth setup: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#nextjs-app-router
- Database client: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#client-setup

### React SPA (Vite, Create React App)

**Load guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-js/guides/setup.md

**Or load framework-specific sections:**
- Auth setup: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#react-spa-vite-create-react-app
- Database client: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#client-setup

### Node.js Backend

**Load framework-specific sections:**
- Auth setup: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#nodejs-backend
- Database client: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#client-setup

---

## Step 7: Add Auth UI (Optional)

Ask: "Want to add pre-built auth UI components? (sign-in, sign-up forms, user button, account settings)"

**If yes**, load the UI setup guide:
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md

**Key points:**
- Import CSS (choose ONE method based on Tailwind detection)
- Create Auth Provider with navigation adapters
- Add routes for auth pages

---

## Step 8: Database Query Patterns

Once client is configured, guide user through PostgREST query syntax:

**Load query reference:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#query-patterns

**Quick examples:**

```typescript
// Select with filters
const { data } = await client.from("items")
  .select("id, name, status")
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(10);

// Insert
const { data, error } = await client.from("items")
  .insert({ name: "New Item", status: "pending" })
  .select()
  .single();
```

---

## Step 9: Type Generation (Optional)

Offer to generate TypeScript types from database schema:

**Load type generation guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#type-generation

**Quick command:**
```bash
npx neon-js gen-types --db-url "postgresql://user:pass@host/db" --output lib/db/database.types.ts
```

---

## Step 10: Validation & Testing

**Load validation checklist:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-js/guides/setup.md#phase-8-validation--testing

**Manual Testing Checklist:**
- [ ] Auth: Sign up a test user
- [ ] Auth: Sign in with test user
- [ ] Auth: Verify session persists
- [ ] Data: Query returns results
- [ ] Data: Insert creates records
- [ ] Data: Update modifies records

**Having Issues?** See:
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md)
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md)
- [Data API Error Handling](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#error-handling)

---

## Step 11: What's Next

Once setup is complete:

"✓ Neon JS SDK is ready! Here's what you can do:
- Visit /auth/sign-up to create an account
- Visit /auth/sign-in to log in
- The UserButton shows a dropdown when signed in
- Visit /account/settings to manage your profile
- Query your database with `client.from('table').select()`
- Google and GitHub OAuth are enabled by default"

---

## Reference Resources

**Setup Guides:**
- [Complete Setup Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-js/guides/setup.md) - Step-by-step walkthrough
- [Auth Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md) - Framework-specific auth patterns
- [Data API Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md) - PostgREST query patterns

**UI & Components:**
- [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md) - All UI components and provider config

**Troubleshooting:**
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns, CSS
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions

**Code Generation:**
- [Code Generation Rules](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/code-generation-rules.md) - Import and CSS strategies

**Main Documentation:**
- [neon-js.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-js.mdc) - Quick reference and patterns
- [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) - Auth-specific patterns

---

## Success Criteria

Setup is complete when:
- [ ] Package installed (@neondatabase/neon-js)
- [ ] Environment variables configured (auth URL + data API URL)
- [ ] Auth client created and exported
- [ ] Database client created and exported
- [ ] (If Next.js) API route handler created
- [ ] (Optional) TypeScript types generated
- [ ] (If using UI) Provider configured
- [ ] User can authenticate successfully
- [ ] Database queries return data
- [ ] No console errors

---

**Template Version**: 1.1.0  
**Last Updated**: 2025-12-09  
**Source Repository**: https://github.com/neondatabase-labs/ai-rules
