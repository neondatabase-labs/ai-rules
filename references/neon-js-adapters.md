# Neon JS SDK - Auth Adapters

Three adapters available for different API styles. **All adapters are factory functions that must be called with `()`.**

## BetterAuthVanillaAdapter (Default)

Used automatically when no adapter is specified. Best for Node.js backends and non-React environments.

```typescript
import { createClient } from "@neondatabase/neon-js";

// Default adapter - no need to specify
const client = createClient({
  auth: { url: process.env.NEON_AUTH_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});

// Auth methods
await client.auth.signIn.email({ email, password });
await client.auth.signUp.email({ email, password, name });
await client.auth.signOut();
const session = await client.auth.getSession();

// Social sign-in
await client.auth.signIn.social({
  provider: 'google', // or 'github'
  callbackURL: '/dashboard',
});
```

## BetterAuthReactAdapter

Provides React hooks for state management. **Must import from subpath.**

```typescript
import { createClient } from "@neondatabase/neon-js";
// NOT exported from main entry - must use subpath
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

const client = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(), // Must call as function
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: { url: import.meta.env.VITE_NEON_DATA_API_URL },
});

// React hook available
function App() {
  const session = client.auth.useSession();

  if (session.isPending) return <div>Loading...</div>;
  if (!session.data) return <LoginForm />;

  return <Dashboard user={session.data.user} />;
}

// Auth methods (same as vanilla)
await client.auth.signIn.email({ email, password });
await client.auth.signUp.email({ email, password, name });
await client.auth.signOut();
```

## SupabaseAuthAdapter

Provides Supabase-compatible API for easier migration. Exported from main entry.

```typescript
import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";

const client = createClient({
  auth: {
    adapter: SupabaseAuthAdapter(), // Must call as function
    url: process.env.NEON_AUTH_URL!,
  },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});

// Supabase-compatible methods
await client.auth.signInWithPassword({ email, password });
await client.auth.signUp({ email, password });
const { data: { session } } = await client.auth.getSession();

// Auth state change listener
client.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});

// Social sign-in (Supabase style)
await client.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: '/dashboard' },
});
```

## Adapter Comparison

| Feature | BetterAuthVanilla | BetterAuthReact | SupabaseAuth |
|---------|-------------------|-----------------|--------------|
| React hooks | No | Yes | No |
| Sign in method | `signIn.email()` | `signIn.email()` | `signInWithPassword()` |
| Get session | `getSession()` | `getSession()` / `useSession()` | `getSession()` |
| State listener | No | React state | `onAuthStateChange()` |
| Bundle size | Smallest | Medium | Medium |
| Best for | Node.js, SSR | React SPAs | Supabase migration |

## Supabase Migration Guide

### Step 1: Update imports

```diff
- import { createClient } from "@supabase/supabase-js";
+ import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";
```

### Step 2: Update client creation

```diff
- const client = createClient(SUPABASE_URL, SUPABASE_KEY);
+ const client = createClient({
+   auth: { adapter: SupabaseAuthAdapter(), url: NEON_AUTH_URL },
+   dataApi: { url: NEON_DATA_API_URL },
+ });
```

### Step 3: Auth methods work the same

```typescript
// These work identically
await client.auth.signInWithPassword({ email, password });
await client.auth.signUp({ email, password });
const { data: { session } } = await client.auth.getSession();
client.auth.onAuthStateChange((event, session) => { /* ... */ });
```

### Step 4: Database queries work the same

```typescript
// PostgREST syntax is identical
const { data } = await client.from("items").select("*");
await client.from("items").insert({ name: "Item" });
await client.from("items").update({ status: "done" }).eq("id", 1);
await client.from("items").delete().eq("id", 1);
```

## Common Adapter Mistakes

### 1. Forgetting to call adapter as function

```typescript
// Wrong
auth: { adapter: SupabaseAuthAdapter, url }

// Correct
auth: { adapter: SupabaseAuthAdapter(), url }
```

### 2. Importing BetterAuthReactAdapter from main entry

```typescript
// Wrong - not exported from main
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";

// Correct
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";
```

### 3. Using wrong API for adapter

```typescript
// Wrong - BetterAuth API with SupabaseAuthAdapter
client.auth.signIn.email({ email, password }); // Won't work

// Correct - Supabase API with SupabaseAuthAdapter
client.auth.signInWithPassword({ email, password });
```

## Auth Only Package

If you don't need database queries, use `@neondatabase/auth` for a smaller bundle:

```typescript
// Install: npm install @neondatabase/auth
import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

// First arg is URL, second is config
const auth = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});

// React hook
const session = auth.useSession();

// Auth methods
await auth.signIn.email({ email, password });
await auth.signUp.email({ email, password, name });
await auth.signOut();
```
