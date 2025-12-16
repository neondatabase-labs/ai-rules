# Neon Auth Setup Reference

Complete setup instructions for Neon Auth across all frameworks. This is the canonical reference for auth client configuration.

## Table of Contents

- [Next.js App Router](#nextjs-app-router)
- [React SPA](#react-spa)
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

## React SPA

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

Skip this section if you're building custom auth forms. Use this if you want pre-built UI components.

#### 5a. Import CSS

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

#### 5b. Update main.tsx with BrowserRouter

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

#### 5c. Create Auth Provider

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

#### 5d. Add Routes to App.tsx

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

**Reference Version**: 1.1.0
**Last Updated**: 2025-12-16
