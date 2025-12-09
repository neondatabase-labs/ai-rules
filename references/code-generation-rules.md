# Code Generation Rules

Rules for generating TypeScript/JavaScript code when working with Neon Auth and Neon JS SDK.

## Table of Contents

- [Import Path Handling](#import-path-handling)
- [Neon Package Imports](#neon-package-imports)
- [CSS Import Strategy](#css-import-strategy)
- [Adapter Patterns](#adapter-patterns)

---

## Import Path Handling

**BEFORE generating import statements, check `tsconfig.json` for path aliases:**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Rules:**
1. **If path aliases exist** (e.g., `"@/*": ["./src/*"]`), use them:
   ```typescript
   import { authClient } from "@/lib/auth/client";
   ```

2. **If NO path aliases exist or unsure**, ALWAYS use relative imports:
   ```typescript
   import { authClient } from "../lib/auth/client";
   ```

3. **Default to relative imports** - they always work regardless of configuration

**Why:** Path aliases require specific TypeScript configuration. Relative imports work universally.

---

## Neon Package Imports

### Critical: Subpath Exports

**BetterAuthReactAdapter MUST be imported from subpath:**

```typescript
// ✅ Correct
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

// ❌ Wrong - will not work
import { BetterAuthReactAdapter } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";
```

**Why:** The React adapter has React-specific dependencies and is tree-shaken out of the main bundle. Using subpath exports keeps the main bundle smaller for non-React environments.

### Adapter Factory Functions

**All adapters are factory functions** - they must be called with `()`:

```typescript
// ✅ Correct
adapter: BetterAuthReactAdapter()
adapter: SupabaseAuthAdapter()
adapter: BetterAuthVanillaAdapter()

// ❌ Wrong
adapter: BetterAuthReactAdapter
adapter: SupabaseAuthAdapter
```

**Why:** Adapters are factory functions that return configured adapter instances. They must be invoked.

### Next.js Integration

**Next.js-specific exports are from subpath:**

```typescript
// ✅ Correct
import { authApiHandler, createAuthClient } from "@neondatabase/auth/next";
import { authApiHandler, createAuthClient } from "@neondatabase/neon-js/auth/next";

// ❌ Wrong
import { authApiHandler } from "@neondatabase/auth";
```

### UI Components

**UI components are from subpath:**

```typescript
// ✅ Correct
import { NeonAuthUIProvider, AuthView } from "@neondatabase/auth/react/ui";
import { NeonAuthUIProvider, AuthView } from "@neondatabase/neon-js/auth/react/ui";

// ❌ Wrong
import { NeonAuthUIProvider } from "@neondatabase/auth";
```

### Server Utilities (Next.js)

**Server utilities are from separate subpath:**

```typescript
// ✅ Correct
import { authViewPaths } from "@neondatabase/auth/react/ui/server";
import { authViewPaths } from "@neondatabase/neon-js/auth/react/ui/server";
```

---

## CSS Import Strategy

**CRITICAL:** Choose ONE import method. Never import both - it causes ~94KB of duplicate styles.

### Detection Steps

**1. Check for Tailwind CSS:**

Look for:
- `tailwind.config.js` or `tailwind.config.ts` in project root
- `@import 'tailwindcss'` or `@tailwind` directives in CSS files
- `tailwindcss` in `package.json` dependencies

**2. Choose Import Method:**

**If Tailwind CSS v4 detected:**

Add to CSS file (e.g., `app/globals.css`, `index.css`):
```css
@import 'tailwindcss';
@import '@neondatabase/auth/ui/tailwind';
/* Or: @import '@neondatabase/neon-js/ui/tailwind'; */
```

**If NO Tailwind:**

Add to app entry point (e.g., `app/layout.tsx`, `src/main.tsx`):
```typescript
import "@neondatabase/auth/ui/css";
// Or: import "@neondatabase/neon-js/ui/css";
```

### Common Mistakes

**❌ Wrong - Importing both:**
```css
/* Causes ~94KB duplicate styles */
@import '@neondatabase/auth/ui/css';
@import '@neondatabase/auth/ui/tailwind';
```

**✅ Correct - One method:**
```css
/* With Tailwind */
@import 'tailwindcss';
@import '@neondatabase/auth/ui/tailwind';
```

```typescript
// Without Tailwind
import "@neondatabase/auth/ui/css";
```

**Why:** The `ui/css` import includes pre-built CSS (~47KB). The `ui/tailwind` import provides Tailwind tokens (~2KB) that generate similar styles. Using both doubles your CSS bundle.

---

## Adapter Patterns

### React SPA Setup

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

export const authClient = client.auth;
```

### Next.js Setup

**No adapter needed** - Next.js integration handles it automatically:

```typescript
import { createAuthClient } from "@neondatabase/auth/next";
// Or: import { createAuthClient } from "@neondatabase/neon-js/auth/next";

export const authClient = createAuthClient();
```

### Node.js Backend

**No adapter needed** - vanilla client works directly:

```typescript
import { createAuthClient } from "@neondatabase/auth";

const auth = createAuthClient(process.env.NEON_AUTH_URL!);
```

### Supabase Compatibility

**Use SupabaseAuthAdapter for Supabase-compatible API:**

```typescript
import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";

const client = createClient({
  auth: {
    adapter: SupabaseAuthAdapter(),
    url: process.env.NEON_AUTH_URL!,
  },
  dataApi: {
    url: process.env.NEON_DATA_API_URL!,
  },
});

// Use Supabase-style methods
await client.auth.signInWithPassword({ email, password });
```

---

## File Structure Patterns

### Next.js App Router

```
app/
  api/
    auth/
      [...path]/
        route.ts          # API route handler
  auth/
    [path]/
      page.tsx            # Auth pages (optional)
  layout.tsx              # Root layout with provider
  auth-provider.tsx       # Auth provider component
lib/
  auth/
    client.ts             # Auth client export
```

### React SPA

```
src/
  lib/
    auth-client.ts        # Auth client with adapter
  providers.tsx           # Auth provider component
  App.tsx                # Routes
  main.tsx               # Entry point with BrowserRouter
```

---

## Common Patterns

### "use client" Directive

**Required for client components using hooks:**

```typescript
"use client";

import { authClient } from "@/lib/auth/client";

function AuthStatus() {
  const session = authClient.useSession();
  // ...
}
```

**When to use:**
- Any component using `authClient.useSession()`
- Any component using UI components (`UserButton`, `SignedIn`, etc.)
- Any component that needs client-side interactivity

**When NOT to use:**
- Server components (Next.js)
- API routes
- Server actions

### Environment Variable Access

**Next.js:**
```typescript
// Server-side
process.env.NEON_AUTH_BASE_URL

// Client-side (must have NEXT_PUBLIC_ prefix)
process.env.NEXT_PUBLIC_NEON_AUTH_URL
```

**Vite/React SPA:**
```typescript
// Must have VITE_ prefix
import.meta.env.VITE_NEON_AUTH_URL
```

**Create React App:**
```typescript
// Must have REACT_APP_ prefix
process.env.REACT_APP_NEON_AUTH_URL
```

---

## Related References

- [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md) - Complete setup guide
- [Import Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-imports.md) - Complete import paths
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Detailed error solutions

---

**Reference Version**: 1.0.0  
**Last Updated**: 2025-12-09
