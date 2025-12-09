# Neon Auth Setup Guide (MCP Prompt Template)

> Interactive guide for setting up Neon Auth. Supports Next.js, Vite/React, and Node.js.

## Communication Style

- **Be concise**: Report actions with checkmarks: "✓ Installed @neondatabase/auth"
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

**Save the `base_url` from the response** - you'll need it for Step 5.

---

## Step 2: Detect Project Context

Automatically detect the user's environment:

**Framework Detection:**
```bash
# Check for Next.js App Router
ls app/layout.tsx app/page.tsx

# Check for Vite/React
ls vite.config.ts src/main.tsx

# Check for Create React App
ls public/index.html src/App.tsx
```

**Existing Setup:**
```bash
# Check if already installed
grep '@neondatabase' package.json

# Check for existing auth
ls app/api/auth lib/auth 2>/dev/null
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

## Step 3: Choose Package

Ask: "Will your app query the database directly (beyond auth)?"

**If YES** (auth + database):
- Recommend: `@neondatabase/neon-js` (full SDK)
- Reason: Includes auth client + Data API client
- Use case: Full-stack apps with database queries
- **Switch to neon-js setup**: Load the neon-js template instead:
  - https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/mcp-prompts/neon-js-setup.md

**If NO** (auth only):
- Recommend: `@neondatabase/auth`
- Reason: Smaller bundle size
- Use case: Auth-only features or separate backend
- **Continue with this guide**

---

## Step 4: Install Dependencies

**Check package.json first**, then install:

```bash
npm install @neondatabase/auth
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
```

**For Vite** - Create/update `.env`:
```bash
VITE_NEON_AUTH_URL=<base_url_from_step_1>
```

**For Create React App** - Create/update `.env`:
```bash
REACT_APP_NEON_AUTH_URL=<base_url_from_step_1>
```

**Important:** Add `.env*` to `.gitignore` if not already present.

---

## Step 6: Create Auth Client

**Load the comprehensive setup guide based on detected framework:**

### Next.js App Router

**Load guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-auth/guides/setup.md

**Or load framework-specific section:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#nextjs-app-router

### React SPA (Vite, Create React App)

**Load guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-auth/guides/setup.md

**Or load framework-specific section:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#react-spa-vite-create-react-app

### Node.js Backend

**Load framework-specific section:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#nodejs-backend

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

## Step 8: Add Account Settings (Optional)

Ask: "Want to add account settings pages where users can manage their profile?"

**If yes**, see the Account Settings section:
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md#accountsettings-views

---

## Step 9: Validation & Testing

**Load validation checklist:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-auth/guides/setup.md#phase-7-validation--testing

**Manual Testing Checklist:**
- [ ] Start development server: `npm run dev`
- [ ] Navigate to `/auth/sign-up` (if using pre-built pages)
- [ ] Create a test account
- [ ] Sign out
- [ ] Sign back in
- [ ] Verify session persists across page refresh
- [ ] Check browser console for errors

**Common Issues:**
- "Module not found" - Check import paths match subpath exports
- Session not persisting - Verify API route is correctly configured
- CSS not loading - Check you imported CSS (only one method)

**For detailed error resolution, see:**
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md)
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md)

---

## Step 10: What's Next

Once setup is complete:

"✓ Neon Auth is ready! Here's what you can do:
- Visit /auth/sign-up to create an account
- Visit /auth/sign-in to log in
- The UserButton shows a dropdown when signed in
- Visit /account/settings to manage your profile
- Google and GitHub OAuth are enabled by default"

---

## Reference Resources

**Setup Guides:**
- [Complete Setup Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-auth/guides/setup.md) - Step-by-step walkthrough
- [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md) - Framework-specific patterns

**UI & Components:**
- [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md) - All UI components and provider config

**Troubleshooting:**
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns, CSS
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions

**Code Generation:**
- [Code Generation Rules](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/code-generation-rules.md) - Import and CSS strategies

**Main Documentation:**
- [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) - Quick reference and patterns

---

## Success Criteria

Setup is complete when:
- [ ] Package installed and in package.json
- [ ] Environment variables configured
- [ ] Auth client created and exported
- [ ] (If Next.js) API route handler created
- [ ] (If using UI) Provider configured
- [ ] User can sign up successfully
- [ ] User can sign in successfully
- [ ] Session persists across page refresh
- [ ] No console errors

---

**Template Version**: 1.1.0  
**Last Updated**: 2025-12-09  
**Source Repository**: https://github.com/neondatabase-labs/ai-rules
