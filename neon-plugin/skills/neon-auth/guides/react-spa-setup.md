# React SPA Auth Setup

Complete guide for setting up Neon Auth with React SPAs (Vite, Create React App) using react-router-dom.

## Table of Contents

- [React SPA Auth Setup](#react-spa-auth-setup)
  - [Table of Contents](#table-of-contents)
  - [Phase 1: Auth Client](#phase-1-auth-client)
  - [Phase 2: UI Setup (Optional)](#phase-2-ui-setup-optional)
    - [2a. Install react-router-dom](#2a-install-react-router-dom)
    - [2b. Import CSS](#2b-import-css)
    - [2c. CSS Variables Reference](#2c-css-variables-reference)
    - [2d. Update main.tsx with BrowserRouter](#2d-update-maintsx-with-browserrouter)
    - [2e. Create Auth Provider](#2e-create-auth-provider)
    - [2f. Add Routes to App.tsx](#2f-add-routes-to-apptsx)
  - [Phase 3: Account Settings (Optional)](#phase-3-account-settings-optional)
    - [Add account routes to App.tsx](#add-account-routes-to-apptsx)
  - [Phase 4: Validation](#phase-4-validation)
  - [Complete App.tsx Example](#complete-apptsx-example)

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

Auth UI **automatically inherits your app's existing theme**. If you have CSS variables like `--primary`, `--background`, etc. defined (from Tailwind, shadcn/ui, or custom CSS), auth components use them with no configuration.

Import order doesn't matter - auth styles are in `@layer neon-auth`, so your styles always win.

**Choose ONE import method.** Never import both - it causes duplicate styles.

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

Auth UI automatically inherits these variables if you have them defined. Use them in custom components for consistency:

| Variable | Purpose |
|----------|---------|
| `--background`, `--foreground` | Page background/text |
| `--card`, `--card-foreground` | Card surfaces |
| `--primary`, `--primary-foreground` | Primary buttons/actions |
| `--muted`, `--muted-foreground` | Muted/subtle elements |
| `--border`, `--ring` | Borders and focus rings |
| `--radius` | Border radius |

**Auth-specific customization:** To customize auth components differently from your main app, use `--neon-*` prefix:

```css
:root {
  --primary: oklch(0.55 0.25 250);       /* Your app's blue */
  --neon-primary: oklch(0.55 0.18 145);  /* Auth uses green */
}
```

**Example - Custom Navbar Styling:**

```css
/* ✅ Correct - uses CSS variables, supports dark mode automatically */
.navbar {
  background: var(--background);
  border-bottom: 1px solid var(--border);
  color: var(--foreground);
}

/* ❌ Wrong - hardcoded colors won't match theme or support dark mode */
.navbar {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  color: #111;
}
```

**Dark mode:** Add the `dark` class to `<html>` or `<body>`. All CSS variable values automatically adjust.

**Complete theming guide:** See [UI Theming Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-theming.md)

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
        // TWO configs required: 1) Enable providers in Neon Console, 2) List them here
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
        // TWO configs required: 1) Enable providers in Neon Console, 2) List them here
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
- `social`: Display social login buttons. Requires TWO configurations: enable in Console + add this prop

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
