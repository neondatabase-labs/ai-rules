# Neon Auth Setup Guide (Interactive)

> **Full Context Document**: This is a combined document containing all Neon Auth setup guides and references. It's generated from multiple source files for comprehensive reference.

<!-- SOURCE: mcp-prompts/neon-auth-setup.md -->
<!-- START: Main Template -->

# Neon Auth Setup (MCP Prompt Template)

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

**For auth-only (`@neondatabase/auth`):**
```bash
npm install @neondatabase/auth
```

Replace `npm install` with your detected package manager (`pnpm add`, `yarn add`, `bun add`).

---

## Step 5: Configure Environment Variables

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

Load the appropriate setup guide based on detected framework:

### Next.js App Router

**Load comprehensive guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-auth/guides/nextjs-setup.md

**What this guide covers:**
- Phase 1: Context Detection
- Phase 2: Package Installation
- Phase 3: Environment Variables
- Phase 4: API Route Setup
- Phase 5: Auth Client Configuration
- Phase 6: UI Provider Setup (Optional)
- Phase 7: Auth Pages (Optional)
- Phase 8: Validation & Testing

### React SPA (Vite, Create React App)

**Load comprehensive guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-plugin/skills/neon-auth/guides/react-spa-setup.md

**What this guide covers:**
- Phase 1: Auth Client Setup
- Phase 2: UI Setup with react-router-dom
- Phase 3: Account Settings
- Phase 4: Validation

### Node.js Backend

**For Node.js backends** (Express, Fastify, etc.):

```typescript
import { createAuthClient } from "@neondatabase/auth";

const auth = createAuthClient(process.env.NEON_AUTH_URL!);

// Use in routes
await auth.signIn.email({ email, password });
const session = await auth.getSession();
```

**Reference**: See Node.js Backend section in main guide:
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc

---

## Step 7: Add Auth UI (Optional)

Ask: "Want to add pre-built auth UI components? (sign-in, sign-up forms, user button, account settings)"

**If yes**, follow the UI setup section in the framework-specific guide:

- **Next.js**: Phase 6-7 in nextjs-setup.md
- **React SPA**: Phase 2-3 in react-spa-setup.md

**Key points for UI setup:**
1. Install react-router-dom (React SPA only)
2. Import CSS (choose ONE method based on Tailwind detection)
3. Create Auth Provider with navigation adapters
4. Add routes for auth pages

---

## Step 8: Add Account Settings (Optional)

Ask: "Want to add account settings pages where users can manage their profile?"

**If yes**, see the Account Settings section in the framework-specific guide.

**Account routes created:**
- `/account/settings` - Profile settings (name, avatar, email)
- `/account/security` - Password, sessions, 2FA
- `/account/sessions` - Active sessions management

---

## Step 9: What's Next

Once setup is complete:

"✓ Neon Auth is ready! Here's what you can do:
- Visit /auth/sign-up to create an account
- Visit /auth/sign-in to log in
- The UserButton shows a dropdown when signed in
- Visit /account/settings to manage your profile
- Google and GitHub OAuth are enabled by default"

---

## Important Notes

- Check existing code/config before making changes
- Provide working code examples
- Don't overwrite existing files without checking first
- If something fails, always give a manual fallback`;

---

## Common Configuration Points

### Critical Import Paths

**Adapter MUST be imported from subpath:**
```typescript
// ✅ Correct
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

// ❌ Wrong - will not work
import { BetterAuthReactAdapter } from "@neondatabase/auth";
```

**Adapter MUST be called as function:**
```typescript
// ✅ Correct
adapter: BetterAuthReactAdapter()

// ❌ Wrong
adapter: BetterAuthReactAdapter
```

### CSS Import Strategy

**Check for Tailwind first**, then:

**If Tailwind v4** detected - Add to CSS file:
```css
@import 'tailwindcss';
@import '@neondatabase/auth/ui/tailwind';
```

**If NO Tailwind** - Import in app entry:
```typescript
import "@neondatabase/auth/ui/css";
```

**⚠️ Never import both** - causes 94KB duplicate styles.

---

## Reference Resources

**Components Reference** (all UI components):
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-components.md

**Provider Configuration** (NeonAuthUIProvider options):
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-provider-config.md

**Common Mistakes:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md

**Troubleshooting Guide:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md

**Auth Adapters Guide** (when to use which):
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-adapters.md

**Import Reference** (complete import paths):
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-imports.md

**UI Theming Guide** (styling and customization):
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-theming.md

**Main Documentation:**
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc

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

## Next Steps After Setup

Once setup is validated:
1. Add protected routes using session checks
2. Customize UI theme (if using pre-built components)
3. Configure social OAuth providers in Neon dashboard
4. Implement password reset flow
5. Add user profile management

---

**Template Version**: 1.1.0
**Last Updated**: 2025-12-09
**Source Repository**: https://github.com/neondatabase-labs/ai-rules

<!-- END: Main Template -->

---

<!-- SOURCE: neon-plugin/skills/neon-auth/guides/nextjs-setup.md -->
<!-- START: Next.js Setup Guide -->

# Next.js Auth Setup

> **Complete Walkthrough**: This is a self-contained, step-by-step guide with its own numbered phases (Phase 1-8).
> Follow each phase in order for a full Neon Auth setup in Next.js App Router.

Complete guide for setting up Neon Auth with Next.js App Router.

### Important:
- Remember to run the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-auth" after completing the guide.

## Table of Contents

- [Next.js Auth Setup](#nextjs-auth-setup)
    - [Important:](#important)
  - [Table of Contents](#table-of-contents)
  - [Workflow Checklist](#workflow-checklist)
  - [Phase 1: Context Detection](#phase-1-context-detection)
  - [Phase 2: Installation](#phase-2-installation)
  - [Phase 3: Environment Configuration](#phase-3-environment-configuration)
  - [Phase 4: API Route Setup](#phase-4-api-route-setup)
  - [Phase 5: Auth Client Configuration](#phase-5-auth-client-configuration)
  - [Phase 6: UI Provider Setup (Optional)](#phase-6-ui-provider-setup-optional)
    - [6.1. Import CSS](#61-import-css)
    - [6.2. Create Auth Provider](#62-create-auth-provider)
    - [6.3. Wrap App in Provider](#63-wrap-app-in-provider)
  - [Phase 7: Auth Pages Setup (Optional)](#phase-7-auth-pages-setup-optional)
  - [Phase 8: Validation \& Testing](#phase-8-validation--testing)
    - [8.1. Manual Testing Checklist](#81-manual-testing-checklist)
  - [Phase 9: Add Best Practices References](#phase-9-add-best-practices-references)
  - [Setup Complete!](#setup-complete)

---

## Workflow Checklist

When following this guide, I will track these high-level tasks:

- [ ] Detect project context (package manager, Next.js version, existing auth)
- [ ] Install @neondatabase/auth package
- [ ] Configure environment variables (auth URL)
- [ ] Create API route handler at /api/auth/[...path]
- [ ] Set up auth client for client components
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

**Check Next.js Version:**
```bash
grep '"next"' package.json
```
Ensure Next.js 13+ with App Router (pages in `app/` directory).

**Check Existing Setup:**
```bash
ls app/api/auth        # Auth routes exist?
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

## Phase 2: Installation

Based on detection, install the auth package:

```bash
[package-manager] add @neondatabase/auth
```

Replace `[package-manager]` with your detected package manager (npm install, pnpm add, yarn add, bun add).

## Phase 3: Environment Configuration

**Outcome**: A working `.env.local` file with the Neon Auth URL.

Create or update `.env.local`:

```bash
# Neon Auth URL - get this from your Neon dashboard
# Format: https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEON_AUTH_BASE_URL=your-neon-auth-url
NEXT_PUBLIC_NEON_AUTH_URL=your-neon-auth-url
```

**Where to find your Auth URL:**
1. Go to your Neon project dashboard
2. Navigate to the "Auth" tab
3. Copy the Auth URL

**Important:** Both variables are needed:
- `NEON_AUTH_BASE_URL` - Used by server-side API routes
- `NEXT_PUBLIC_NEON_AUTH_URL` - Used by client-side components (prefixed with NEXT_PUBLIC_)

Add to `.gitignore` if not already present:
```
.env.local
```

## Phase 4: API Route Setup

Create the API route handler for authentication endpoints:

**Create file:** `app/api/auth/[...path]/route.ts`

```typescript
import { authApiHandler } from "@neondatabase/auth/next";

export const { GET, POST } = authApiHandler();
```

This creates endpoints for:
- `/api/auth/sign-in` - Sign in
- `/api/auth/sign-up` - Sign up
- `/api/auth/sign-out` - Sign out
- `/api/auth/session` - Get session
- And other auth-related endpoints

## Phase 5: Auth Client Configuration

Create the auth client for use in client components:

**Create file:** `lib/auth/client.ts`

```typescript
import { createAuthClient } from "@neondatabase/auth/next";

export const authClient = createAuthClient();
```

**Usage in components:**

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

function SignInButton() {
  return (
    <button onClick={() => authClient.signIn.email({
      email: "user@example.com",
      password: "password"
    })}>
      Sign In
    </button>
  );
}
```

## Phase 6: UI Provider Setup (Optional)

Skip this phase if you're building custom auth forms. Use this if you want pre-built UI components.

### 6.1. Import CSS

**If using Tailwind (tailwind.config.{js,ts} exists):**

Add to your global CSS file (e.g., `app/globals.css`):
```css
@import '@neondatabase/auth/ui/tailwind';
```

**If NOT using Tailwind:**

Add to `app/layout.tsx`:
```typescript
import "@neondatabase/auth/ui/css";
```

**Warning:** Never import both - causes 94KB of duplicate styles.

### 6.2. Create Auth Provider

**Create file:** `app/auth-provider.tsx`

```typescript
"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

**To add social login buttons**, add the `social` prop:
```typescript
<NeonAuthUIProvider
  authClient={authClient}
  navigate={router.push}
  replace={router.replace}
  onSessionChange={() => router.refresh()}
  Link={Link}
  social={{
    providers: ["google", "github"]
  }}
>
  {children}
</NeonAuthUIProvider>
```

### 6.3. Wrap App in Provider

**Update:** `app/layout.tsx`

```typescript
import { AuthProvider } from "./auth-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## Phase 7: Auth Pages Setup (Optional)

Skip this phase if you're using custom auth forms. Use this for pre-built auth pages.

**Create file:** `app/auth/[path]/page.tsx`

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

This creates routes for:
- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset form
- `/auth/magic-link` - Magic link sign in
- `/auth/two-factor` - Two-factor authentication
- `/auth/callback` - OAuth callback
- `/auth/sign-out` - Sign out page

## Phase 8: Validation & Testing

### 8.1. Manual Testing Checklist

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
- CSS not loading - Check you imported CSS in layout (only one method)

For detailed error resolution, see:
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md)
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md)

## Phase 9: Add Best Practices References

Before executing the add-neon-docs skill, provide a summary of everything that has been done:

"Neon Auth integration is complete! Now adding documentation references..."

Then execute the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-auth"

This will add reference links to Neon Auth best practices documentation in your project's AI documentation file.

---

## Setup Complete!

Your Neon Auth integration is ready to use.

**What's working:**
- Authentication API routes at `/api/auth/*`
- Client-side auth hooks via `authClient.useSession()`
- (If configured) Pre-built UI components and auth pages

**Next steps:**
- Add protected routes using session checks
- Customize UI theme (see neon-auth.mdc for theming)
- Set up social OAuth providers in Neon dashboard

<!-- END: Next.js Setup Guide -->

---

<!-- SOURCE: neon-plugin/skills/neon-auth/guides/react-spa-setup.md -->
<!-- START: React SPA Setup Guide -->

# React SPA Auth Setup

Complete guide for setting up Neon Auth with React SPAs (Vite, Create React App) using react-router-dom.

## Table of Contents

- [Phase 1: Auth Client](#phase-1-auth-client)
- [Phase 2: UI Setup](#phase-2-ui-setup-optional)
  - [2a. Install react-router-dom](#2a-install-react-router-dom)
  - [2b. Import CSS](#2b-import-css)
  - [2c. CSS Variables Reference](#2c-css-variables-reference)
  - [2d. Update main.tsx with BrowserRouter](#2d-update-maintsx-with-browserrouter)
  - [2e. Create Auth Provider](#2e-create-auth-provider)
  - [2f. Add Routes to App.tsx](#2f-add-routes-to-apptsx)
- [Phase 3: Account Settings](#phase-3-account-settings-optional)
- [Phase 4: Validation](#phase-4-validation)

---

## Phase 1: Auth Client

Create `src/lib/auth-client.ts`:

**For `@neondatabase/auth`:**
```typescript
import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

export const authClient = createAuthClient(
  import.meta.env.VITE_NEON_AUTH_URL,
  { adapter: BetterAuthReactAdapter() }
);
```

**For `@neondatabase/neon-js`:**
```typescript
import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

export const client = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(),
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});

// For convenience, export auth separately
export const authClient = client.auth;
```

**Critical:**
- `BetterAuthReactAdapter` must be imported from the `/react/adapters` subpath
- The adapter must be called as a function: `BetterAuthReactAdapter()`

---

## Phase 2: UI Setup (Optional)

Ask: "Want to add pre-built auth UI components? (sign-in, sign-up forms, user button, account settings)"

**If yes, continue with sub-steps below.**

### 2a. Install react-router-dom

```bash
npm install react-router-dom
```

UI components are included in the main package, you only need react-router-dom for navigation.

### 2b. Import CSS

**CRITICAL:** Choose ONE import method. Never import both - it causes duplicate styles.

**Check if the project uses Tailwind CSS** by looking for:
- `tailwind.config.js` or `tailwind.config.ts` in the project root
- `@import 'tailwindcss'` or `@tailwind` directives in CSS files
- `tailwindcss` in package.json dependencies

**If NOT using Tailwind** - Add to `src/main.tsx` or entry point:

For `@neondatabase/auth`:
```typescript
import '@neondatabase/auth/ui/css';
```

For `@neondatabase/neon-js`:
```typescript
import '@neondatabase/neon-js/ui/css';
```

**If using Tailwind CSS v4** - Add to main CSS file (e.g., index.css):

For `@neondatabase/auth`:
```css
@import 'tailwindcss';
@import '@neondatabase/auth/ui/tailwind';
```

For `@neondatabase/neon-js`:
```css
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/tailwind';
```

### 2c. CSS Variables Reference

**IMPORTANT:** The UI package already includes all necessary CSS variables. Do NOT copy these into your own CSS file.

**ALWAYS use these CSS variables** when creating custom components (navbar, layouts, pages, etc.) to ensure:
- Visual consistency with auth components
- Automatic dark mode support
- Proper theming integration

| Variable | Purpose | Usage |
|----------|---------|-------|
| `--background`, `--foreground` | Page background/text | `hsl(var(--background))` |
| `--card`, `--card-foreground` | Card surfaces | `hsl(var(--card))` |
| `--primary`, `--primary-foreground` | Primary buttons/actions | `hsl(var(--primary))` |
| `--secondary`, `--secondary-foreground` | Secondary elements | `hsl(var(--secondary))` |
| `--muted`, `--muted-foreground` | Muted/subtle elements | `hsl(var(--muted))` |
| `--destructive` | Destructive/danger actions | `hsl(var(--destructive))` |
| `--border`, `--input`, `--ring` | Borders and focus rings | `hsl(var(--border))` |
| `--radius` | Border radius | `var(--radius)` |

**Example - Custom Navbar Styling:**

```css
/* ✅ Correct - uses CSS variables, supports dark mode automatically */
.navbar {
  background: hsl(var(--background));
  border-bottom: 1px solid hsl(var(--border));
  color: hsl(var(--foreground));
}

.navbar-link {
  color: hsl(var(--muted-foreground));
}

.navbar-link:hover {
  color: hsl(var(--foreground));
}

/* ❌ Wrong - hardcoded colors won't match theme or support dark mode */
.navbar {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  color: #111;
}
```

**Dark mode:** Add the `dark` class to `<html>` or `<body>` to enable it. All CSS variable values automatically adjust.

### 2d. Update main.tsx with BrowserRouter

For `@neondatabase/auth`:
```tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@neondatabase/auth/ui/css'; // if not using Tailwind
import App from './App';
import { Providers } from './providers';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>
);
```

For `@neondatabase/neon-js`:
```tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@neondatabase/neon-js/ui/css'; // if not using Tailwind
import App from './App';
import { Providers } from './providers';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>
);
```

### 2e. Create Auth Provider

Create `src/providers.tsx`:

For `@neondatabase/auth`:
```tsx
import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authClient } from './lib/auth-client';
import type { ReactNode } from 'react';

// Adapter for react-router-dom Link
function Link({ href, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <RouterLink to={href} {...props} />;
}

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={(path) => navigate(path)}
      replace={(path) => navigate(path, { replace: true })}
      onSessionChange={() => {
        // Optional: refresh data or invalidate cache
      }}
      Link={Link}
      social={{
        providers: ['google', 'github']
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

For `@neondatabase/neon-js`:
```tsx
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react/ui';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authClient } from './lib/auth-client';
import type { ReactNode } from 'react';

// Adapter for react-router-dom Link
function Link({ href, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <RouterLink to={href} {...props} />;
}

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={(path) => navigate(path)}
      replace={(path) => navigate(path, { replace: true })}
      onSessionChange={() => {
        // Optional: refresh data or invalidate cache
      }}
      Link={Link}
      social={{
        providers: ['google', 'github']
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

**Provider props explained:**
- `navigate`: Function to navigate to a new route
- `replace`: Function to replace current route (for redirects)
- `onSessionChange`: Callback when auth state changes (useful for cache invalidation)
- `Link`: Adapter component for react-router-dom's Link
- `social`: Show Google and GitHub sign-in buttons (both enabled by default in Neon)

### 2f. Add Routes to App.tsx

For `@neondatabase/auth`:
```tsx
import { Routes, Route, useParams } from 'react-router-dom';
import { AuthView, UserButton, SignedIn, SignedOut } from '@neondatabase/auth/react/ui';

// Auth page - handles /auth/sign-in, /auth/sign-up, etc.
function AuthPage() {
  const { pathname } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthView pathname={pathname} />
    </div>
  );
}

// Simple navbar example
function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <a href="/">My App</a>
      <div className="flex items-center gap-4">
        <SignedOut>
          <a href="/auth/sign-in">Sign In</a>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

function HomePage() {
  return <div>Welcome to My App!</div>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/:pathname" element={<AuthPage />} />
      </Routes>
    </>
  );
}
```

For `@neondatabase/neon-js`:
```tsx
import { Routes, Route, useParams } from 'react-router-dom';
import { AuthView, UserButton, SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react/ui';

// Auth page - handles /auth/sign-in, /auth/sign-up, etc.
function AuthPage() {
  const { pathname } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthView pathname={pathname} />
    </div>
  );
}

// Simple navbar example
function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <a href="/">My App</a>
      <div className="flex items-center gap-4">
        <SignedOut>
          <a href="/auth/sign-in">Sign In</a>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

function HomePage() {
  return <div>Welcome to My App!</div>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/:pathname" element={<AuthPage />} />
      </Routes>
    </>
  );
}
```

**Auth routes created:**
- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Set new password
- `/auth/sign-out` - Sign out
- `/auth/callback` - OAuth callback (internal)

---

## Phase 3: Account Settings (Optional)

Ask: "Want to add account settings pages where users can manage their profile?"

**If yes:**

### Add account routes to App.tsx

For `@neondatabase/auth`:
```tsx
import { AccountView } from '@neondatabase/auth/react/ui';

// Account settings page
function AccountPage() {
  const { pathname } = useParams();
  return (
    <div className="container mx-auto py-8">
      <AccountView pathname={pathname} />
    </div>
  );
}

// Add to your Routes
<Route path="/account/:pathname" element={<AccountPage />} />
```

For `@neondatabase/neon-js`:
```tsx
import { AccountView } from '@neondatabase/neon-js/auth/react/ui';

// Account settings page
function AccountPage() {
  const { pathname } = useParams();
  return (
    <div className="container mx-auto py-8">
      <AccountView pathname={pathname} />
    </div>
  );
}

// Add to your Routes
<Route path="/account/:pathname" element={<AccountPage />} />
```

**Account routes created:**
- `/account/settings` - Profile settings (name, avatar, email)
- `/account/security` - Password, sessions, 2FA
- `/account/sessions` - Active sessions management

---

## Phase 4: Validation

After setup completes, guide user through testing:

- [ ] Start development server: `npm run dev`
- [ ] Navigate to `/auth/sign-up`
- [ ] Create a test account
- [ ] Sign out
- [ ] Sign back in
- [ ] Verify session persists across page refresh
- [ ] Check browser console for errors

**Common Issues:**
- "Module not found" - Check import paths match subpath exports
- Session not persisting - Verify auth client is configured correctly
- CSS not loading - Check you imported CSS (only one method)

---

## Complete App.tsx Example

Here's a complete example with all routes:

```tsx
import { Routes, Route, useParams } from 'react-router-dom';
import { 
  AuthView, 
  AccountView,
  UserButton, 
  SignedIn, 
  SignedOut 
} from '@neondatabase/auth/react/ui';

function AuthPage() {
  const { pathname } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthView pathname={pathname} />
    </div>
  );
}

function AccountPage() {
  const { pathname } = useParams();
  return (
    <div className="container mx-auto py-8">
      <AccountView pathname={pathname} />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <a href="/">My App</a>
      <div className="flex items-center gap-4">
        <SignedOut>
          <a href="/auth/sign-in">Sign In</a>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1>Welcome to My App!</h1>
      <SignedIn>
        <p>You are signed in.</p>
      </SignedIn>
      <SignedOut>
        <p>Please sign in to continue.</p>
      </SignedOut>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/:pathname" element={<AuthPage />} />
        <Route path="/account/:pathname" element={<AccountPage />} />
      </Routes>
    </>
  );
}
```

---

**Guide Version**: 1.0.0
**Last Updated**: 2025-12-09

<!-- END: React SPA Setup Guide -->

---

<!-- SOURCE: references/neon-auth-components.md -->
<!-- START: UI Components Reference -->

# Neon Auth UI Components Reference

Complete reference for all UI components available in `@neondatabase/auth` and `@neondatabase/neon-js`.

## Import Paths

| What | `@neondatabase/auth` | `@neondatabase/neon-js` |
|------|---------------------|------------------------|
| Auth client | `@neondatabase/auth` | `@neondatabase/neon-js` |
| React adapter | `@neondatabase/auth/react/adapters` | `@neondatabase/neon-js/auth/react/adapters` |
| UI components | `@neondatabase/auth/react/ui` | `@neondatabase/neon-js/auth/react/ui` |
| Server utilities | `@neondatabase/auth/react/ui/server` | `@neondatabase/neon-js/auth/react/ui/server` |
| CSS | `@neondatabase/auth/ui/css` | `@neondatabase/neon-js/ui/css` |
| Tailwind | `@neondatabase/auth/ui/tailwind` | `@neondatabase/neon-js/ui/tailwind` |

---

## Authentication Views

### AuthView

Full auth view that handles routing between sign-in, sign-up, forgot-password, etc.

```tsx
import { AuthView } from "@neondatabase/auth/react/ui";

// Use with dynamic routing
function AuthPage() {
  const { pathname } = useParams();
  return <AuthView pathname={pathname} />;
}

// Or with static path
<AuthView pathname="sign-in" />
```

**Props:**
- `pathname`: The auth view to render (`"sign-in"`, `"sign-up"`, `"forgot-password"`, `"reset-password"`, `"magic-link"`, `"two-factor"`, `"callback"`, `"sign-out"`)

### Individual Forms

Embed individual auth forms anywhere in your app:

```tsx
import { SignInForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm } from "@neondatabase/auth/react/ui";

// Sign in form
<SignInForm />

// Sign up form
<SignUpForm />

// Forgot password form
<ForgotPasswordForm />

// Reset password form (typically used with token from email)
<ResetPasswordForm />
```

---

## User Components

### UserButton

Dropdown button showing user avatar with menu for settings and sign out.

```tsx
import { UserButton } from "@neondatabase/auth/react/ui";

<UserButton />
```

The dropdown includes:
- User name and email
- Link to account settings
- Sign out button

### UserAvatar

Just the user's avatar image.

```tsx
import { UserAvatar } from "@neondatabase/auth/react/ui";

<UserAvatar />
```

---

## Conditional Rendering

### SignedIn

Render children only when user is authenticated.

```tsx
import { SignedIn } from "@neondatabase/auth/react/ui";

<SignedIn>
  <p>Welcome back!</p>
  <UserButton />
</SignedIn>
```

### SignedOut

Render children only when user is NOT authenticated.

```tsx
import { SignedOut } from "@neondatabase/auth/react/ui";

<SignedOut>
  <a href="/auth/sign-in">Sign In</a>
</SignedOut>
```

### AuthLoading

Render children while auth state is being determined.

```tsx
import { AuthLoading } from "@neondatabase/auth/react/ui";

<AuthLoading>
  <p>Loading...</p>
</AuthLoading>
```

### Combined Usage

```tsx
import { SignedIn, SignedOut, AuthLoading, UserButton } from "@neondatabase/auth/react/ui";

function AuthStatus() {
  return (
    <>
      <AuthLoading>
        <span>Loading...</span>
      </AuthLoading>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <a href="/auth/sign-in">Sign In</a>
      </SignedOut>
    </>
  );
}
```

---

## Protected Routes

### RedirectToSignIn

Automatically redirect unauthenticated users to sign-in page.

```tsx
import { RedirectToSignIn, SignedIn } from "@neondatabase/auth/react/ui";

function ProtectedPage() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <p>This content is only visible to authenticated users.</p>
      </SignedIn>
    </>
  );
}
```

---

## Account/Settings Views

### AccountView

Full account settings view with navigation between different settings sections.

```tsx
import { AccountView } from "@neondatabase/auth/react/ui";

// Use with dynamic routing
function AccountPage() {
  const { pathname } = useParams();
  return <AccountView pathname={pathname} />;
}

// Or with static path
<AccountView pathname="settings" />
```

**Available pathnames:**
- `"settings"` - Profile settings (name, avatar, email)
- `"security"` - Password and 2FA settings
- `"sessions"` - Active sessions management

### SettingsCards

Render all settings cards together (alternative to AccountView).

```tsx
import { SettingsCards } from "@neondatabase/auth/react/ui";

<SettingsCards />
```

---

## Individual Settings Cards

Build custom settings pages by using individual cards:

```tsx
import {
  UpdateAvatarCard,
  UpdateNameCard,
  ChangeEmailCard,
  ChangePasswordCard,
  SessionsCard,
  DeleteAccountCard
} from "@neondatabase/auth/react/ui";

function CustomSettingsPage() {
  return (
    <div className="space-y-4">
      <UpdateAvatarCard />
      <UpdateNameCard />
      <ChangeEmailCard />
      <ChangePasswordCard />
      <SessionsCard />
      <DeleteAccountCard />
    </div>
  );
}
```

### Card Descriptions

| Card | Description |
|------|-------------|
| `UpdateAvatarCard` | Upload/change profile picture |
| `UpdateNameCard` | Change display name |
| `ChangeEmailCard` | Update email address |
| `ChangePasswordCard` | Change password |
| `SessionsCard` | View and revoke active sessions |
| `DeleteAccountCard` | Permanently delete account |

---

## Server Utilities

### authViewPaths (Next.js)

For Next.js static generation of auth pages:

```tsx
import { authViewPaths } from "@neondatabase/auth/react/ui/server";

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}
```

---

## Component Customization

All components accept `className` and `classNames` props for styling:

```tsx
<SignInForm
  className="max-w-md mx-auto"
  classNames={{
    card: "shadow-lg",
    button: "rounded-full",
    input: "bg-gray-50",
  }}
/>
```

### Available classNames

Different components have different customizable parts. Common ones include:
- `card` - The card container
- `button` - Action buttons
- `input` - Form inputs
- `title` - Section titles
- `description` - Description text

---

## Complete Import Example

```tsx
// All commonly used components
import {
  // Views
  AuthView,
  AccountView,
  
  // Forms
  SignInForm,
  SignUpForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  
  // User
  UserButton,
  UserAvatar,
  
  // Conditional
  SignedIn,
  SignedOut,
  AuthLoading,
  RedirectToSignIn,
  
  // Settings
  SettingsCards,
  UpdateAvatarCard,
  UpdateNameCard,
  ChangeEmailCard,
  ChangePasswordCard,
  SessionsCard,
  DeleteAccountCard,
} from "@neondatabase/auth/react/ui";

// Server utilities (Next.js)
import { authViewPaths } from "@neondatabase/auth/react/ui/server";
```

---

**Reference Version**: 1.0.0
**Last Updated**: 2025-12-09

<!-- END: UI Components Reference -->

---

<!-- SOURCE: references/neon-auth-provider-config.md -->
<!-- START: Provider Configuration Reference -->

# NeonAuthUIProvider Configuration

Complete reference for configuring the `NeonAuthUIProvider` component.

## Overview

`NeonAuthUIProvider` is the context provider that wraps your app to enable Neon Auth UI components. It handles navigation, session state, and provides configuration for social login, avatar uploads, and localization.

---

## Full Configuration Example

```tsx
<NeonAuthUIProvider
  // Required props
  authClient={authClient}
  navigate={navigate}
  replace={replace}
  Link={Link}
  
  // Optional: Session management
  onSessionChange={() => {
    // Called when auth state changes
    // Useful for cache invalidation, refetching data
  }}
  
  // Optional: Avatar upload
  avatar={{
    upload: async (file) => {
      // Upload file to your storage (S3, Cloudinary, etc.)
      const url = await uploadToStorage(file);
      return url; // Return the public URL
    },
  }}
  
  // Optional: Social login providers
  social={{
    providers: ["google", "github"],
  }}
  
  // Optional: UI text customization
  localization={{
    signIn: "Log In",
    signUp: "Create Account",
    // ... other strings
  }}
>
  {children}
</NeonAuthUIProvider>
```

---

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `authClient` | `AuthClient` | Yes | The auth client instance from `createAuthClient()` |
| `navigate` | `(path: string) => void` | Yes | Function to navigate to a new route |
| `replace` | `(path: string) => void` | Yes | Function to replace current route (for redirects) |
| `Link` | `Component` | Yes | Link component adapter for your framework |
| `onSessionChange` | `() => void` | No | Callback fired when authentication state changes |
| `avatar` | `{ upload: (file: File) => Promise<string> }` | No | Avatar upload configuration |
| `social` | `{ providers: string[] }` | No | Social login providers to display |
| `localization` | `object` | No | UI text overrides |

---

## Framework-Specific Setup

### Next.js App Router

```tsx
"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
      social={{
        providers: ["google", "github"]
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

**Key points:**
- Use `router.push` for `navigate`
- Use `router.replace` for `replace`
- Use `router.refresh()` in `onSessionChange` to refetch server data
- Next.js `Link` component works directly (no adapter needed)

### React Router (Vite, CRA)

```tsx
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { authClient } from "./lib/auth-client";
import type { ReactNode } from "react";

// Create a Link adapter
function Link({ href, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <RouterLink to={href} {...props} />;
}

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={(path) => navigate(path)}
      replace={(path) => navigate(path, { replace: true })}
      onSessionChange={() => {
        // Optional: invalidate queries, refetch data
      }}
      Link={Link}
      social={{
        providers: ["google", "github"]
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

**Key points:**
- Create a `Link` adapter that converts `href` to `to` prop
- Use `navigate(path)` for `navigate`
- Use `navigate(path, { replace: true })` for `replace`
- Provider must be inside `BrowserRouter`

### TanStack Router

```tsx
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { useRouter, Link as TanStackLink } from "@tanstack/react-router";
import { authClient } from "./lib/auth-client";

function Link({ href, ...props }: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <TanStackLink to={href} {...props} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={(path) => router.navigate({ to: path })}
      replace={(path) => router.navigate({ to: path, replace: true })}
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

---

## Avatar Upload Configuration

Enable users to upload profile pictures:

```tsx
<NeonAuthUIProvider
  // ... other props
  avatar={{
    upload: async (file: File) => {
      // Example: Upload to your own API
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const { url } = await response.json();
      return url; // Return the public URL of the uploaded image
    },
  }}
>
```

### Example: Upload to Cloudinary

```tsx
avatar={{
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset");
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
      { method: "POST", body: formData }
    );
    
    const data = await response.json();
    return data.secure_url;
  },
}}
```

### Example: Upload to S3 (presigned URL)

```tsx
avatar={{
  upload: async (file) => {
    // Get presigned URL from your API
    const { uploadUrl, publicUrl } = await fetch("/api/get-upload-url", {
      method: "POST",
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    }).then(r => r.json());
    
    // Upload directly to S3
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    
    return publicUrl;
  },
}}
```

---

## Social Login Configuration

Configure which social login buttons to display:

```tsx
<NeonAuthUIProvider
  // ... other props
  social={{
    providers: ["google", "github"]
  }}
>
```

**Available providers:**
- `"google"` - Google OAuth
- `"github"` - GitHub OAuth

**Note:** Social providers must be configured in your Neon dashboard for them to work. Google and GitHub are enabled by default.

### Hide Social Login

To hide social login buttons entirely:

```tsx
social={{
  providers: []
}}
```

---

## Localization

Customize UI text for different languages or branding:

```tsx
<NeonAuthUIProvider
  // ... other props
  localization={{
    // Sign In page
    signIn: "Log In",
    signInTitle: "Welcome back",
    signInDescription: "Enter your credentials to continue",
    
    // Sign Up page
    signUp: "Create Account",
    signUpTitle: "Get started",
    signUpDescription: "Create your account to continue",
    
    // Form fields
    email: "Email address",
    password: "Password",
    name: "Full name",
    
    // Buttons
    submit: "Continue",
    forgotPassword: "Forgot password?",
    
    // Social
    continueWithGoogle: "Continue with Google",
    continueWithGithub: "Continue with GitHub",
    
    // ... many more strings available
  }}
>
```

---

## Session Change Handling

The `onSessionChange` callback is fired when:
- User signs in
- User signs out
- Session is refreshed
- Session expires

**Common use cases:**

### Refetch Server Data (Next.js)

```tsx
onSessionChange={() => router.refresh()}
```

### Invalidate TanStack Query Cache

```tsx
const queryClient = useQueryClient();

onSessionChange={() => {
  queryClient.invalidateQueries();
}}
```

### Update Global State

```tsx
onSessionChange={() => {
  // Reset app state
  resetAppState();
  // Refetch user-specific data
  refetchUserData();
}}
```

---

## Complete Example with All Options

```tsx
"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      Link={Link}
      
      onSessionChange={() => {
        router.refresh();
        queryClient.invalidateQueries();
      }}
      
      avatar={{
        upload: async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload-avatar", {
            method: "POST",
            body: formData,
          });
          const { url } = await res.json();
          return url;
        },
      }}
      
      social={{
        providers: ["google", "github"],
      }}
      
      localization={{
        signIn: "Log In",
        signUp: "Create Account",
        signInTitle: "Welcome to MyApp",
        signUpTitle: "Join MyApp",
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

---

**Reference Version**: 1.0.0
**Last Updated**: 2025-12-09

<!-- END: Provider Configuration Reference -->

---

<!-- SOURCE: references/neon-auth-common-mistakes.md -->
<!-- START: Common Mistakes Reference -->

# Neon Auth/JS - Common Mistakes

Reference guide for common mistakes when using `@neondatabase/auth` or `@neondatabase/neon-js`.

## Table of Contents

- [Import Mistakes](#import-mistakes)
  - [BetterAuthReactAdapter Subpath Requirement](#betterauthreactadapter-subpath-requirement)
  - [Adapter Factory Functions](#adapter-factory-functions)
- [CSS Import Mistakes](#css-import-mistakes)
- [Configuration Mistakes](#configuration-mistakes)
  - [Wrong createAuthClient Signature](#wrong-createauthclient-signature)
  - [Missing Environment Variables](#missing-environment-variables)
- [Usage Mistakes](#usage-mistakes)
  - [Missing "use client" Directive](#missing-use-client-directive)
  - [Wrong API for Adapter](#wrong-api-for-adapter)

---

## Import Mistakes

### BetterAuthReactAdapter Subpath Requirement

`BetterAuthReactAdapter` is **NOT** exported from the main package entry. You must import it from the subpath.

**Wrong:**
```typescript
// These will NOT work
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/auth";
```

**Correct:**
```typescript
// For @neondatabase/neon-js
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

// For @neondatabase/auth
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";
```

**Why:** The React adapter has React-specific dependencies and is tree-shaken out of the main bundle. Using subpath exports keeps the main bundle smaller for non-React environments.

### Adapter Factory Functions

All adapters are **factory functions** that must be called with `()`.

**Wrong:**
```typescript
const client = createClient({
  auth: {
    adapter: BetterAuthReactAdapter,  // Missing ()
    url: process.env.NEON_AUTH_URL!,
  },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

**Correct:**
```typescript
const client = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(),  // Called as function
    url: process.env.NEON_AUTH_URL!,
  },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

This applies to all adapters:
- `BetterAuthReactAdapter()`
- `BetterAuthVanillaAdapter()`
- `SupabaseAuthAdapter()`

---

## CSS Import Mistakes

Auth UI components require CSS. Choose **ONE** method based on your project.

### With Tailwind v4

```css
/* In app/globals.css */
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/tailwind';
/* Or: @import '@neondatabase/auth/ui/tailwind'; */
```

### Without Tailwind

```typescript
// In app/layout.tsx
import "@neondatabase/neon-js/ui/css";
// Or: import "@neondatabase/auth/ui/css";
```

### Never Import Both

**Wrong:**
```css
/* Causes ~94KB of duplicate styles */
@import '@neondatabase/neon-js/ui/css';
@import '@neondatabase/neon-js/ui/tailwind';
```

**Why:** The `ui/css` import includes pre-built CSS (~47KB). The `ui/tailwind` import provides Tailwind tokens (~2KB) that generate similar styles. Using both doubles your CSS bundle.

---

## Configuration Mistakes

### Wrong createAuthClient Signature

The `createAuthClient` function takes the URL as the first argument, not as a property in an options object.

**Wrong:**
```typescript
// This will NOT work
createAuthClient({ baseURL: url });
createAuthClient({ url: myUrl });
```

**Correct:**
```typescript
// Vanilla client - URL as first arg
createAuthClient(url);

// With adapter - URL as first arg, options as second
createAuthClient(url, { adapter: BetterAuthReactAdapter() });

// Next.js client - no arguments (uses env vars automatically)
import { createAuthClient } from "@neondatabase/auth/next";
const authClient = createAuthClient();
```

### Missing Environment Variables

**Required for Next.js:**
```bash
# .env.local
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth

# For neon-js (auth + data)
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**Required for Vite/React SPA:**
```bash
# .env
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
VITE_NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**Important:**
- `NEON_AUTH_BASE_URL` - Server-side auth
- `NEXT_PUBLIC_*` prefix - Required for client-side access in Next.js
- `VITE_*` prefix - Required for client-side access in Vite
- Restart dev server after adding env vars

---

## Usage Mistakes

### Missing "use client" Directive

Client components using `useSession()` need the `"use client"` directive.

**Wrong:**
```typescript
// Missing directive - will cause hydration errors
import { authClient } from "@/lib/auth/client";

function AuthStatus() {
  const session = authClient.useSession();
  // ...
}
```

**Correct:**
```typescript
"use client";

import { authClient } from "@/lib/auth/client";

function AuthStatus() {
  const session = authClient.useSession();
  // ...
}
```

### Wrong API for Adapter

Each adapter has its own API style. Don't mix them.

**Wrong - BetterAuth API with SupabaseAuthAdapter:**
```typescript
const client = createClient({
  auth: { adapter: SupabaseAuthAdapter(), url },
  dataApi: { url },
});

// This won't work with SupabaseAuthAdapter
await client.auth.signIn.email({ email, password });
```

**Correct - Supabase API with SupabaseAuthAdapter:**
```typescript
const client = createClient({
  auth: { adapter: SupabaseAuthAdapter(), url },
  dataApi: { url },
});

// Use Supabase-style methods
await client.auth.signInWithPassword({ email, password });
```

**API Reference by Adapter:**

| Adapter | Sign In | Sign Up | Get Session |
|---------|---------|---------|-------------|
| BetterAuthVanillaAdapter | `signIn.email({ email, password })` | `signUp.email({ email, password })` | `getSession()` |
| BetterAuthReactAdapter | `signIn.email({ email, password })` | `signUp.email({ email, password })` | `useSession()` / `getSession()` |
| SupabaseAuthAdapter | `signInWithPassword({ email, password })` | `signUp({ email, password })` | `getSession()` |

---

## Related Resources

- [Auth Adapters Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-adapters.md) - Detailed adapter comparison
- [Import Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-imports.md) - Complete import paths
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions

<!-- END: Common Mistakes Reference -->

---

<!-- SOURCE: references/neon-auth-troubleshooting.md -->
<!-- START: Troubleshooting Reference -->

# Neon Auth/JS Troubleshooting

Common issues and solutions for `@neondatabase/auth` and `@neondatabase/neon-js`.

## Table of Contents

- [Import Errors](#import-errors)
- [Adapter Errors](#adapter-errors)
- [Configuration Errors](#configuration-errors)
- [Session Issues](#session-issues)
- [UI Component Issues](#ui-component-issues)
- [Data API Issues](#data-api-issues)
- [Type Generation Issues](#type-generation-issues)
- [Database Sync Issues](#database-sync-issues)
- [Social Auth Issues](#social-auth-issues)
- [Still Having Issues?](#still-having-issues)

---

## Import Errors

### BetterAuthReactAdapter not found

**Error:**
```
Module '"@neondatabase/neon-js"' has no exported member 'BetterAuthReactAdapter'
Module '"@neondatabase/auth"' has no exported member 'BetterAuthReactAdapter'
```

**Cause:** BetterAuthReactAdapter is exported from a subpath, not the main entry point.

**Solution:**
```typescript
// Wrong
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";

// Correct - use subpath
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";
// Or for auth-only package:
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";
```

### Cannot find module '@neondatabase/auth/next'

**Error:**
```
Cannot find module '@neondatabase/auth/next' or its corresponding type declarations
```

**Cause:** Package not installed or wrong version.

**Solution:**
```bash
# Verify installation
npm list @neondatabase/auth

# Reinstall if needed
npm install @neondatabase/auth@latest
# Or for full SDK:
npm install @neondatabase/neon-js@latest
```

---

## Adapter Errors

### Adapter is not a function

**Error:**
```
TypeError: adapter is not a function
```

**Cause:** Adapter passed as class instead of called as factory function.

**Solution:**
```typescript
// Wrong
adapter: BetterAuthReactAdapter  // Missing ()

// Correct
adapter: BetterAuthReactAdapter()  // Called as function
```

### Supabase adapter API mismatch

**Error:**
```
TypeError: client.auth.signIn.email is not a function
```

**Cause:** Using BetterAuth API methods with SupabaseAuthAdapter.

**Solution:**
```typescript
// BetterAuth style (default adapter)
await client.auth.signIn.email({ email, password });

// Supabase style (with SupabaseAuthAdapter)
await client.auth.signInWithPassword({ email, password });
```

---

## Configuration Errors

### Wrong createAuthClient signature

**Error:**
```
TypeError: Cannot read properties of undefined (reading 'baseURL')
```

**Cause:** Using wrong argument structure for createAuthClient.

**Solution:**
```typescript
// Wrong
createAuthClient({ baseURL: url })

// Correct (vanilla client)
createAuthClient(url)

// Correct (with adapter)
createAuthClient(url, { adapter: BetterAuthReactAdapter() })

// Correct (Next.js client - no arguments needed)
import { createAuthClient } from "@neondatabase/auth/next";
const authClient = createAuthClient();  // Uses env vars automatically
```

### Missing environment variables

**Error:**
```
Error: NEON_AUTH_BASE_URL is not defined
Error: NEON_DATA_API_URL is not defined
```

**Solution:**

Create `.env.local` with required variables:

```bash
# Auth
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth

# Data API (neon-js only)
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

Restart development server after adding env vars.

### Wrong URL format

**Error:**
```
FetchError: request to https://... failed
```

**Common URL format issues:**

1. **Auth URL should end with `/auth`:**
   ```
   https://ep-xxx.neonauth.*.aws.neon.build/dbname/auth
   ```

2. **Data API URL should end with `/rest/v1`:**
   ```
   https://ep-xxx.apirest.*.aws.neon.build/dbname/rest/v1
   ```

3. **Don't include trailing slash**

---

## Session Issues

### Session not persisting across page refresh

**Possible causes and solutions:**

1. **API route not configured correctly**
   - Verify `app/api/auth/[...path]/route.ts` exists
   - Check route exports both GET and POST:
   ```typescript
   export const { GET, POST } = authApiHandler();
   ```

2. **Cookies not being set**
   - Check browser dev tools > Application > Cookies
   - Auth cookies should be set after sign-in

3. **HTTPS required in production**
   - Auth cookies are secure by default
   - Use HTTPS in production, localhost works in development

### useSession returns undefined

**Error:**
```
Cannot read properties of undefined (reading 'data')
```

**Solution:**

1. Ensure component has `"use client"` directive:
```typescript
"use client";

import { authClient } from "@/lib/auth/client";

function Component() {
  const session = authClient.useSession();
  // ...
}
```

2. Handle loading state:
```typescript
const session = authClient.useSession();

if (session.isPending) return <div>Loading...</div>;
if (!session.data) return <div>Not signed in</div>;

return <div>Hello, {session.data.user.name}</div>;
```

---

## UI Component Issues

### CSS not loading / unstyled components

**Cause:** CSS import missing or wrong import method.

**Solution:**

For Tailwind projects (has `tailwind.config.{js,ts}`):
```css
/* In app/globals.css */
@import '@neondatabase/neon-js/ui/tailwind';
/* Or: @import '@neondatabase/auth/ui/tailwind'; */
```

For non-Tailwind projects:
```typescript
// In app/layout.tsx
import "@neondatabase/neon-js/ui/css";
// Or: import "@neondatabase/auth/ui/css";
```

**Warning:** Never use both methods - causes 94KB duplicate styles.

### AuthView showing blank page

**Possible causes:**

1. **Missing generateStaticParams**
```typescript
// Required for static generation
export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}
```

2. **Wrong path parameter handling**
```typescript
// Next.js 15 - params is Promise
export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return <AuthView path={path} />;
}
```

3. **Provider not wrapping app**
   - Ensure `AuthProvider` wraps children in `app/layout.tsx`

---

## Data API Issues

*These issues apply to `@neondatabase/neon-js` only.*

### Query returns empty data

**Possible causes:**

1. **Table is empty** - Check data exists in Neon console
2. **Wrong table name** - Table names are case-sensitive
3. **Filters too restrictive** - Remove filters to test

**Debug query:**
```typescript
const { data, error, count } = await dbClient
  .from("your_table")
  .select("*", { count: "exact" });

console.log({ data, error, count });
```

### Permission denied errors

**Error:**
```
PostgrestError: permission denied for table users
```

**Cause:** Row Level Security (RLS) blocking access, or user doesn't have permissions.

**Solutions:**

1. **Check RLS policies** in Neon console
2. **Ensure Data API is enabled** for the table
3. **Verify authenticated user** has access to the resource

### Table not found

**Error:**
```
PostgrestError: relation "tablename" does not exist
```

**Solutions:**

1. **Check table exists** in Neon console
2. **Check schema** - Default is `public`, use `schema_name.table_name` if different
3. **Case sensitivity** - PostgreSQL lowercases unquoted names
4. **Enable table for Data API** in Neon console

---

## Type Generation Issues

*These issues apply to `@neondatabase/neon-js` only.*

### gen-types command fails

**Error:**
```
Error: Connection refused
```

**Solution:**

1. Verify DATABASE_URL format:
   ```
   postgresql://user:password@host/database?sslmode=require
   ```

2. Check database is accessible from your machine

3. Try with explicit parameters:
   ```bash
   npx neon-js gen-types \
     --db-url "postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require" \
     --output lib/db/database.types.ts
   ```

### Types don't match schema

**Cause:** Types generated from old schema.

**Solution:**
1. Re-run type generation after schema changes
2. Add to build script:
   ```json
   {
     "scripts": {
       "db:types": "neon-js gen-types --db-url $DATABASE_URL --output lib/db/database.types.ts"
     }
   }
   ```

---

## Social Auth Issues

### OAuth callback error

**Error:**
```
OAuth callback failed: Invalid redirect URI
```

**Solution:**
1. Go to your OAuth provider (Google, GitHub, etc.)
2. Add these redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/[provider]`
   - Production: `https://yourdomain.com/api/auth/callback/[provider]`

3. Verify OAuth credentials are configured in Neon dashboard

---

## Still Having Issues?

1. **Check versions:**
   ```bash
   npm list @neondatabase/auth @neondatabase/neon-js
   ```

2. **Clear caches:**
   ```bash
   rm -rf node_modules/.cache .next
   npm install
   ```

3. **Reference documentation:**
   - [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md)
   - [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) - Auth patterns
   - [neon-js.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-js.mdc) - Full SDK reference

4. **Check Neon status:**
   - Verify services are running in Neon console
   - Check Auth and Data API are enabled for your project

<!-- END: Troubleshooting Reference -->

---

**Document Generated**: 2025-12-09
**Source Files Combined**: 
- mcp-prompts/neon-auth-setup.md
- neon-plugin/skills/neon-auth/guides/nextjs-setup.md
- neon-plugin/skills/neon-auth/guides/react-spa-setup.md
- references/neon-auth-components.md
- references/neon-auth-provider-config.md
- references/neon-auth-common-mistakes.md
- references/neon-auth-troubleshooting.md
