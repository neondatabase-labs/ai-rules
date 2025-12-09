# Neon Auth Setup Guide

> **Complete Walkthrough**: This is a self-contained, step-by-step guide with numbered phases.
> Follow each phase in order for a full Neon Auth setup.

Complete guide for setting up Neon Auth with Next.js App Router, React SPA, or Node.js.

### Important:
- Remember to run the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-auth" after completing the guide.

## Table of Contents

- [Workflow Checklist](#workflow-checklist)
- [Phase 1: Context Detection](#phase-1-context-detection)
- [Phase 2: Installation](#phase-2-installation)
- [Phase 3: Environment Configuration](#phase-3-environment-configuration)
- [Phase 4: Framework-Specific Setup](#phase-4-framework-specific-setup)
  - [Next.js App Router](#nextjs-app-router)
  - [React SPA](#react-spa)
  - [Node.js Backend](#nodejs-backend)
- [Phase 5: UI Provider Setup (Optional)](#phase-5-ui-provider-setup-optional)
- [Phase 6: Auth Pages Setup (Optional)](#phase-6-auth-pages-setup-optional)
- [Phase 7: Validation & Testing](#phase-7-validation--testing)
- [Phase 8: Add Best Practices References](#phase-8-add-best-practices-references)

---

## Workflow Checklist

When following this guide, I will track these high-level tasks:

- [ ] Detect project context (package manager, framework, existing auth)
- [ ] Install @neondatabase/auth package
- [ ] Configure environment variables (auth URL)
- [ ] Set up auth client based on framework
- [ ] (Optional) Set up UI provider with pre-built components
- [ ] (Optional) Create auth pages (/auth/sign-in, etc.)
- [ ] Validate setup and test authentication flow
- [ ] Add Neon Auth best practices to project docs

---

## Phase 1: Context Detection

Auto-detect project context:

**Check Package Manager:**
```bash
ls package-lock.json  # -> npm
ls bun.lockb          # -> bun
ls pnpm-lock.yaml     # -> pnpm
ls yarn.lock          # -> yarn
```

**Check Framework:**
```bash
# Next.js App Router
ls app/layout.tsx app/page.tsx

# Vite/React SPA
ls vite.config.ts src/main.tsx

# Create React App
ls public/index.html src/App.tsx

# Node.js backend
grep -E '(express|fastify|koa)' package.json
```

**Check Existing Setup:**
```bash
ls app/api/auth        # Auth routes exist? (Next.js)
ls lib/auth            # Auth client exists?
grep '@neondatabase' package.json  # Already installed?
```

**Check for Tailwind:**
```bash
ls tailwind.config.js tailwind.config.ts 2>/dev/null
```

**Check Environment Files:**
```bash
ls .env .env.local
```

---

## Phase 2: Installation

Based on detection, install the auth package:

```bash
[package-manager] add @neondatabase/auth
```

Replace `[package-manager]` with your detected package manager (npm install, pnpm add, yarn add, bun add).

---

## Phase 3: Environment Configuration

**Outcome**: A working environment file with the Neon Auth URL.

**For Next.js** - Create/update `.env.local`:
```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**For Vite** - Create/update `.env`:
```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**For Create React App** - Create/update `.env`:
```bash
REACT_APP_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**For Node.js** - Create/update `.env`:
```bash
NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**Where to find your Auth URL:**
1. Go to your Neon project dashboard
2. Navigate to the "Auth" tab
3. Copy the Auth URL

**Important:** Add `.env*` files to `.gitignore` if not already present.

**Complete reference:** See [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#environment-variables)

---

## Phase 4: Framework-Specific Setup

### Next.js App Router

**1. API Route Handler**

Create `app/api/auth/[...path]/route.ts`:

```typescript
import { authApiHandler } from "@neondatabase/auth/next";

export const { GET, POST } = authApiHandler();
```

**2. Auth Client**

Create `lib/auth/client.ts`:

```typescript
import { createAuthClient } from "@neondatabase/auth/next";

export const authClient = createAuthClient();
```

**3. Use in Components**

```typescript
"use client";

import { authClient } from "@/lib/auth/client";

function AuthStatus() {
  const session = authClient.useSession();

  if (session.isPending) return <div>Loading...</div>;
  if (!session.data) return <SignInButton />;

  return (
    <div>
      <p>Hello, {session.data.user.name}</p>
      <button onClick={() => authClient.signOut()}>Sign Out</button>
    </div>
  );
}
```

**Complete setup:** See [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#nextjs-app-router)

### React SPA

**1. Auth Client**

Create `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

export const authClient = createAuthClient(
  import.meta.env.VITE_NEON_AUTH_URL,
  { adapter: BetterAuthReactAdapter() }
);
```

**2. Use in Components**

```typescript
import { authClient } from "./lib/auth-client";

function App() {
  const session = authClient.useSession();

  if (session.isPending) return <div>Loading...</div>;
  if (!session.data) return <LoginForm />;

  return <Dashboard user={session.data.user} />;
}
```

**Complete setup:** See [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#react-spa-vite-create-react-app)

### Node.js Backend

**1. Auth Client**

```typescript
import { createAuthClient } from "@neondatabase/auth";

const auth = createAuthClient(process.env.NEON_AUTH_URL!);
```

**2. Use in Routes**

```typescript
// Express example
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await auth.signIn.email({ email, password });
  
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  
  res.json({ session: data });
});
```

**Complete setup:** See [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md#nodejs-backend)

---

## Phase 5: UI Provider Setup (Optional)

Skip this phase if you're building custom auth forms. Use this if you want pre-built UI components.

**Complete UI setup:** See [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md)

**Quick summary:**

1. **Import CSS** (choose ONE method):
   - With Tailwind: `@import '@neondatabase/auth/ui/tailwind';` in CSS file
   - Without Tailwind: `import "@neondatabase/auth/ui/css";` in layout/app file

2. **Create Auth Provider** with framework-specific navigation adapters

3. **Wrap app** in the provider

**Framework-specific examples:** See [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md#provider-setup)

---

## Phase 6: Auth Pages Setup (Optional)

Skip this phase if you're using custom auth forms. Use this for pre-built auth pages.

**For Next.js:**

Create `app/auth/[path]/page.tsx`:

```typescript
import { AuthView } from "@neondatabase/auth/react/ui";
import { authViewPaths } from "@neondatabase/auth/react/ui/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return <AuthView path={path} />;
}
```

This creates routes: `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, etc.

**For React SPA:**

See [React SPA Setup Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-auth/guides/react-spa-setup.md) for routing setup.

---

## Phase 7: Validation & Testing

### Manual Testing Checklist

- [ ] Start development server: `npm run dev`
- [ ] Navigate to `/auth/sign-up` (if using pre-built pages)
- [ ] Create a test account
- [ ] Sign out
- [ ] Sign back in
- [ ] Verify session persists across page refresh
- [ ] Check browser console for errors

**Common Issues:**
- "Module not found" - Check import paths match subpath exports
- Session not persisting - Verify API route is correctly configured (Next.js) or auth client is configured correctly (React SPA)
- CSS not loading - Check you imported CSS (only one method)

**For detailed error resolution, see:**
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md)
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md)

---

## Phase 8: Add Best Practices References

Before executing the add-neon-docs skill, provide a summary of everything that has been done:

"Neon Auth integration is complete! Now adding documentation references..."

Then execute the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-auth"

This will add reference links to Neon Auth best practices documentation in your project's AI documentation file.

---

## Setup Complete!

Your Neon Auth integration is ready to use.

**What's working:**
- Authentication API routes at `/api/auth/*` (Next.js)
- Client-side auth hooks via `authClient.useSession()`
- (If configured) Pre-built UI components and auth pages

**Next steps:**
- Add protected routes using session checks
- Customize UI theme (see [UI Theming Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-theming.md))
- Set up social OAuth providers in Neon dashboard

**Reference Documentation:**
- [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md) - Complete setup guide
- [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md) - All UI components
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns

---

**Guide Version**: 1.0.0  
**Last Updated**: 2025-12-09
