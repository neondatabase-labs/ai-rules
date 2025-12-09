# Troubleshooting Neon Auth

Common issues and solutions for Neon Auth integration.

## Table of Contents

- [Troubleshooting Neon Auth](#troubleshooting-neon-auth)
  - [Table of Contents](#table-of-contents)
  - [Import Errors](#import-errors)
    - [BetterAuthReactAdapter not found](#betterauthreactadapter-not-found)
    - [Cannot find module '@neondatabase/auth/next'](#cannot-find-module-neondaboruthentication-snext)
  - [Adapter Errors](#adapter-errors)
    - [Adapter is not a function](#adapter-is-not-a-function)
  - [Configuration Errors](#configuration-errors)
    - [Wrong createAuthClient signature](#wrong-createauthclient-signature)
    - [Missing environment variables](#missing-environment-variables)
  - [Session Issues](#session-issues)
    - [Session not persisting across page refresh](#session-not-persisting-across-page-refresh)
    - [useSession returns undefined](#usesession-returns-undefined)
  - [UI Component Issues](#ui-component-issues)
    - [CSS not loading / unstyled components](#css-not-loading--unstyled-components)
    - [AuthView showing blank page](#authview-showing-blank-page)
  - [Database Sync Issues](#database-sync-issues)
    - [Cannot modify users\_sync table](#cannot-modify-users_sync-table)
    - [User not appearing in users\_sync](#user-not-appearing-in-users_sync)
  - [Social Auth Issues](#social-auth-issues)
    - [OAuth callback error](#oauth-callback-error)
  - [Still Having Issues?](#still-having-issues)

---

## Import Errors

### BetterAuthReactAdapter not found

**Error:**
```
Module '"@neondatabase/auth"' has no exported member 'BetterAuthReactAdapter'
```

**Cause:** BetterAuthReactAdapter is exported from a subpath, not the main entry point.

**Solution:**
```typescript
// Wrong
import { BetterAuthReactAdapter } from "@neondatabase/auth";

// Correct
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";
```

### Cannot find module '@neondatabase/auth/next'

**Error:**
```
Cannot find module '@neondatabase/auth/next' or its corresponding type declarations
```

**Cause:** Package not installed or wrong package version.

**Solution:**
1. Verify installation:
```bash
npm list @neondatabase/auth
```

2. Reinstall if needed:
```bash
npm install @neondatabase/auth@latest
```

3. Check `node_modules/@neondatabase/auth/package.json` has `exports` field with `/next` subpath.

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
const auth = createAuthClient(url, {
  adapter: BetterAuthReactAdapter  // Missing ()
});

// Correct
const auth = createAuthClient(url, {
  adapter: BetterAuthReactAdapter()  // Called as function
});
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
```

**Solution:**
1. Create `.env.local` file in project root
2. Add required variables:
```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```
3. Restart development server (env changes require restart)

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

**Cause:** Using useSession outside of client component or before client is initialized.

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
@import '@neondatabase/auth/ui/tailwind';
```

For non-Tailwind projects:
```typescript
// In app/layout.tsx
import "@neondatabase/auth/ui/css";
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

## Database Sync Issues

### Cannot modify users_sync table

**Error:**
```
ERROR: permission denied for table users_sync
```

**Cause:** The `neon_auth.users_sync` table is read-only. It's automatically populated by Neon Auth.

**Solution:**
- Do NOT try to INSERT, UPDATE, or DELETE from users_sync
- Use auth methods (signUp, signIn) to create/modify users
- Query the table for user data:
```sql
SELECT * FROM neon_auth.users_sync WHERE deleted_at IS NULL;
```

### User not appearing in users_sync

**Possible causes:**

1. **Auth not enabled in Neon dashboard**
   - Go to Neon Console > Your Project > Auth
   - Enable Neon Auth if not already enabled

2. **Using wrong database**
   - Verify your app connects to the same database where Auth is enabled

3. **Sync delay**
   - User sync is near-instant but may have brief delay
   - Try querying after a few seconds

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

1. **Check the full error stack** - Look for the root cause
2. **Verify versions** - Ensure @neondatabase/auth is latest
3. **Clear caches:**
   ```bash
   rm -rf node_modules/.cache
   rm -rf .next
   npm install
   ```
4. **Run validation script:**
   ```bash
   npx ts-node neon-plugin/skills/neon-auth/scripts/validate-auth-setup.ts
   ```
5. **Reference documentation:** See [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) for complete API reference
