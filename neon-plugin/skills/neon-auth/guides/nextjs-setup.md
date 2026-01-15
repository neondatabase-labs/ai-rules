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
    - [6.4. Add Navbar with Session Info](#64-add-navbar-with-session-info)
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

Auth UI **automatically inherits your app's existing theme**. If you have CSS variables like `--primary`, `--background`, etc. defined (from Tailwind, shadcn/ui, or custom CSS), auth components use them with no configuration.

Import order doesn't matter - auth styles are in `@layer neon-auth`, so your styles always win.

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

**Auth-specific customization:** To customize auth components differently from your main app, use `--neon-*` prefix variables. See the [theming guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-theming.md) for details.

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
    // TWO configs required: 1) Enable providers in Neon Console, 2) List them here
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

### 6.4. Add Navbar with Session Info

Create a navbar component that shows the user's session status:

**Create file:** `components/navbar.tsx`

```typescript
"use client";

import { UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/">My App</Link>
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link href="/auth/sign-in">Sign In</Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
```

**Add to layout:** Update `app/layout.tsx` to include the navbar:

```typescript
import { AuthProvider } from "./auth-provider";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Components explained:**
- `<SignedOut>` - Only renders children when user is NOT authenticated
- `<SignedIn>` - Only renders children when user IS authenticated
- `<UserButton />` - Displays user avatar with dropdown menu (sign out, account settings)

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
  return <AuthView pathname={path} />;
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
