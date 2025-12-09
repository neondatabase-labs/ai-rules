# Troubleshooting Neon JS SDK

Common issues and solutions for the Neon JS SDK (auth + data API).

## Table of Contents

- [Troubleshooting Neon JS SDK](#troubleshooting-neon-js-sdk)
  - [Table of Contents](#table-of-contents)
  - [Import Errors](#import-errors)
    - [BetterAuthReactAdapter not found](#betterauthreactadapter-not-found)
    - [Cannot find module '@neondatabase/neon-js'](#cannot-find-module-neondaboruthenticationbneon-js)
  - [Adapter Errors](#adapter-errors)
    - [Adapter is not a function](#adapter-is-not-a-function)
    - [Supabase adapter API mismatch](#supabase-adapter-api-mismatch)
  - [Configuration Errors](#configuration-errors)
    - [Missing environment variables](#missing-environment-variables)
    - [Wrong URL format](#wrong-url-format)
  - [Auth Issues](#auth-issues)
    - [Session not persisting](#session-not-persisting)
    - [useSession returns undefined](#usesession-returns-undefined)
  - [Data API Issues](#data-api-issues)
    - [Query returns empty data](#query-returns-empty-data)
    - [Permission denied errors](#permission-denied-errors)
    - [Table not found](#table-not-found)
  - [Type Generation Issues](#type-generation-issues)
    - [gen-types command fails](#gen-types-command-fails)
    - [Types don't match schema](#types-dont-match-schema)
  - [UI Component Issues](#ui-component-issues)
    - [CSS not loading](#css-not-loading)
  - [Still Having Issues?](#still-having-issues)

---

## Import Errors

### BetterAuthReactAdapter not found

**Error:**
```
Module '"@neondatabase/neon-js"' has no exported member 'BetterAuthReactAdapter'
```

**Cause:** BetterAuthReactAdapter is exported from a subpath, not the main entry point.

**Solution:**
```typescript
// Wrong
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";

// Correct
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";
```

### Cannot find module '@neondatabase/neon-js'

**Error:**
```
Cannot find module '@neondatabase/neon-js' or its corresponding type declarations
```

**Cause:** Package not installed.

**Solution:**
```bash
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
adapter: BetterAuthReactAdapter

// Correct
adapter: BetterAuthReactAdapter()
```

### Supabase adapter API mismatch

**Error:**
```
TypeError: client.auth.signIn.email is not a function
```

**Cause:** Using BetterAuth API methods with SupabaseAuthAdapter.

**Solution:**

With SupabaseAuthAdapter, use Supabase-style methods:
```typescript
// BetterAuth style (default)
await client.auth.signIn.email({ email, password });

// Supabase style (with SupabaseAuthAdapter)
await client.auth.signInWithPassword({ email, password });
```

---

## Configuration Errors

### Missing environment variables

**Error:**
```
Error: NEON_DATA_API_URL is not defined
```

**Solution:**

Ensure `.env.local` has all required variables:
```bash
# Auth
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth

# Data API
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

## Auth Issues

### Session not persisting

**Possible causes:**

1. **API route not configured** - Verify `app/api/auth/[...path]/route.ts` exists
2. **Wrong exports** - Ensure route exports both GET and POST
3. **Cookies blocked** - Check browser allows cookies

### useSession returns undefined

**Solution:**

1. Add `"use client"` directive
2. Handle loading state:
```typescript
"use client";
const session = authClient.useSession();

if (session.isPending) return <div>Loading...</div>;
if (!session.data) return <div>Not signed in</div>;
```

---

## Data API Issues

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

## UI Component Issues

### CSS not loading

**Cause:** CSS import missing or wrong method.

**Solution:**

For Tailwind projects:
```css
/* In app/globals.css */
@import '@neondatabase/neon-js/ui/tailwind';
```

For non-Tailwind:
```typescript
// In app/layout.tsx
import "@neondatabase/neon-js/ui/css";
```

**Warning:** Don't use both - causes 94KB duplicate styles.

---

## Still Having Issues?

1. **Check versions:**
   ```bash
   npm list @neondatabase/neon-js
   ```

2. **Clear caches:**
   ```bash
   rm -rf node_modules/.cache .next
   npm install
   ```

3. **Reference documentation:**
   - [neon-js.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-js.mdc) - Full SDK reference
   - [neon-auth.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc) - Auth patterns

4. **Check Neon status:**
   - Verify services are running in Neon console
   - Check Auth and Data API are enabled for your project
