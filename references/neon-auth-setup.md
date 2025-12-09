# Neon Auth Setup Reference

Complete setup instructions for Neon Auth across all frameworks. This is the canonical reference for auth client configuration.

## Table of Contents

- [Next.js App Router](#nextjs-app-router)
- [React SPA (Vite, Create React App)](#react-spa-vite-create-react-app)
- [Node.js Backend](#nodejs-backend)
- [Environment Variables](#environment-variables)
- [Package Selection](#package-selection)

---

## Next.js App Router

### 1. Install Package

```bash
npm install @neondatabase/auth
# Or: npm install @neondatabase/neon-js
```

### 2. Environment Variables

Create or update `.env.local`:

```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**Important:** Both variables are needed:
- `NEON_AUTH_BASE_URL` - Used by server-side API routes
- `NEXT_PUBLIC_NEON_AUTH_URL` - Used by client-side components (prefixed with NEXT_PUBLIC_)

### 3. API Route Handler

Create `app/api/auth/[...path]/route.ts`:

```typescript
import { authApiHandler } from "@neondatabase/auth/next";
// Or: import { authApiHandler } from "@neondatabase/neon-js/auth/next";

export const { GET, POST } = authApiHandler();
```

This creates endpoints for:
- `/api/auth/sign-in` - Sign in
- `/api/auth/sign-up` - Sign up
- `/api/auth/sign-out` - Sign out
- `/api/auth/session` - Get session
- And other auth-related endpoints

### 4. Auth Client Configuration

Create `lib/auth/client.ts`:

```typescript
import { createAuthClient } from "@neondatabase/auth/next";
// Or: import { createAuthClient } from "@neondatabase/neon-js/auth/next";

export const authClient = createAuthClient();
```

### 5. Use in Components

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

### 6. UI Provider Setup (Optional)

For pre-built UI components, see: [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md#nextjs-provider-setup)

---

## React SPA (Vite, Create React App)

### 1. Install Package

```bash
npm install @neondatabase/auth
# Or: npm install @neondatabase/neon-js
npm install react-router-dom  # Required for UI components
```

### 2. Environment Variables

Create or update `.env`:

```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

For Create React App, use:
```bash
REACT_APP_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

### 3. Auth Client Configuration

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

export const authClient = client.auth;
```

**Critical:**
- `BetterAuthReactAdapter` must be imported from the `/react/adapters` subpath
- The adapter must be called as a function: `BetterAuthReactAdapter()`

### 4. Use in Components

```typescript
import { authClient } from "./lib/auth-client";

function App() {
  const session = authClient.useSession();

  if (session.isPending) return <div>Loading...</div>;
  if (!session.data) return <LoginForm />;

  return <Dashboard user={session.data.user} />;
}
```

### 5. UI Provider Setup (Optional)

For pre-built UI components, see: [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md#react-spa-provider-setup)

---

## Node.js Backend

### 1. Install Package

```bash
npm install @neondatabase/auth
```

### 2. Environment Variables

Create or update `.env`:

```bash
NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

### 3. Auth Client Configuration

```typescript
import { createAuthClient } from "@neondatabase/auth";

const auth = createAuthClient(process.env.NEON_AUTH_URL!);
```

### 4. Use in Routes

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

// Get session
app.get("/api/session", async (req, res) => {
  const session = await auth.getSession();
  res.json({ session });
});
```

---

## Environment Variables

### Next.js

```bash
# .env.local
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

### Vite/React SPA

```bash
# .env
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

### Create React App

```bash
# .env
REACT_APP_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

### Node.js

```bash
# .env
NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**Where to find your Auth URL:**
1. Go to your Neon project dashboard
2. Navigate to the "Auth" tab
3. Copy the Auth URL

**Important:** Add `.env*` files to `.gitignore` if not already present.

---

## Package Selection

| Need | Package | Bundle Size |
|------|---------|-------------|
| Auth only | `@neondatabase/auth` | Smaller (~50KB) |
| Auth + Database queries | `@neondatabase/neon-js` | Full (~150KB) |

**Recommendation:** Use `@neondatabase/auth` if you only need authentication. Use `@neondatabase/neon-js` if you also need PostgREST-style database queries.

---

## Related References

- [UI Components Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui.md) - Complete UI setup guide
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns
- [Code Generation Rules](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/code-generation-rules.md) - Import and CSS strategies
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions

---

**Reference Version**: 1.0.0  
**Last Updated**: 2025-12-09
