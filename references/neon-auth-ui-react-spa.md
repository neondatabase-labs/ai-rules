# Neon Auth UI - React SPA (Vite)

Complete UI setup guide for Neon Auth in React Single Page Applications.

---

## Quick Setup

### 1. Install Dependencies

```bash
npm install react-router-dom
```

### 2. Import CSS

**If using Tailwind CSS v4:**
```css
/* In index.css */
@import 'tailwindcss';
@import '@neondatabase/auth/ui/tailwind';
```

**If NOT using Tailwind:**
```typescript
// In src/main.tsx
import '@neondatabase/auth/ui/css';
```

**Warning:** Never import both - causes duplicate styles.

### 3. Update main.tsx with BrowserRouter

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

### 4. Create Provider

Create `src/providers.tsx`:

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
        // Optional: invalidate queries, refetch data
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

### 5. Add Routes

Update `src/App.tsx`:

```tsx
import { Routes, Route, useParams } from 'react-router-dom';
import { AuthView, UserButton, SignedIn, SignedOut } from '@neondatabase/auth/react/ui';

function AuthPage() {
  const { pathname } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthView pathname={pathname} />
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

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
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

## Provider Configuration

### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `authClient` | `AuthClient` | Yes | The auth client instance |
| `navigate` | `(path: string) => void` | Yes | react-router's navigate function |
| `replace` | `(path: string) => void` | Yes | Navigate with replace |
| `Link` | `Component` | Yes | Link adapter (see above) |
| `onSessionChange` | `() => void` | No | Auth state change callback |
| `avatar` | `{ upload: (file: File) => Promise<string> }` | No | Avatar upload config |
| `social` | `{ providers: string[] }` | No | Social login providers |

### Social Login

```tsx
<NeonAuthUIProvider
  social={{
    providers: ['google', 'github']
  }}
>
```

**Note:** Social buttons require TWO configurations:
1. Enable providers in Neon Console (Auth tab)
2. Add the `social` prop shown above to display buttons

### Avatar Upload

```tsx
<NeonAuthUIProvider
  avatar={{
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await response.json();
      return url;
    },
  }}
>
```

---

## UI Components

### Authentication

```tsx
import { AuthView, SignInForm, SignUpForm } from '@neondatabase/auth/react/ui';

// Full auth view (recommended)
<AuthView pathname="sign-in" />

// Individual forms
<SignInForm />
<SignUpForm />
```

### User Components

```tsx
import { UserButton, UserAvatar, SignedIn, SignedOut } from '@neondatabase/auth/react/ui';

<SignedOut>
  <a href="/auth/sign-in">Sign In</a>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

### Protected Routes

```tsx
import { RedirectToSignIn, SignedIn } from '@neondatabase/auth/react/ui';

function ProtectedPage() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <p>Protected content</p>
      </SignedIn>
    </>
  );
}
```

### Account Settings

```tsx
import { AccountView, SettingsCards } from '@neondatabase/auth/react/ui';

// Full account view
<AccountView pathname="settings" />

// Or individual cards
import {
  UpdateAvatarCard,
  UpdateNameCard,
  ChangeEmailCard,
  ChangePasswordCard,
  SessionsCard,
  DeleteAccountCard
} from '@neondatabase/auth/react/ui';
```

---

## TanStack Router Setup

If using TanStack Router instead of react-router-dom:

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

## CSS Variables

Auth UI **automatically inherits your app's existing theme**. If you have CSS variables like `--primary`, `--background`, etc. defined (from Tailwind, shadcn/ui, or custom CSS), auth components use them with no configuration.

Import order doesn't matter - auth styles are in `@layer neon-auth`, so your styles always win.

### Use in Custom Components

| Variable | Purpose |
|----------|---------|
| `--background`, `--foreground` | Page background/text |
| `--card`, `--card-foreground` | Card surfaces |
| `--primary`, `--primary-foreground` | Primary buttons |
| `--muted`, `--muted-foreground` | Muted elements |
| `--border`, `--ring` | Borders and focus rings |
| `--radius` | Border radius |

**Usage:**
```css
background: var(--background);
color: var(--foreground);
```

### Auth-Specific Customization

To customize auth components differently from your main app, use `--neon-*` prefix:
```css
:root {
  --neon-primary: oklch(0.55 0.18 145);  /* Only affects auth */
}
```

**Dark mode:** Add the `dark` class to `<html>` or `<body>`.

---

## Import Paths

| What | Import Path |
|------|-------------|
| UI Provider | `@neondatabase/auth/react/ui` |
| Components | `@neondatabase/auth/react/ui` |
| CSS | `@neondatabase/auth/ui/css` |
| Tailwind | `@neondatabase/auth/ui/tailwind` |
| React Adapter | `@neondatabase/auth/react/adapters` |

---

## Related References

- [Setup - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-react-spa.md) - Auth client setup
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns
- [Troubleshooting](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions

---

**Reference Version**: 1.1.0
**Last Updated**: 2025-12-16
