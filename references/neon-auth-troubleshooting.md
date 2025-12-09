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
