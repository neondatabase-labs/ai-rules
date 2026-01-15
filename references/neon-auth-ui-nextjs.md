# Neon Auth UI - Next.js App Router

Complete UI setup guide for Neon Auth in Next.js App Router applications.

---

## Quick Setup

### 1. Import CSS

**If using Tailwind:**
```css
/* In app/globals.css */
@import '@neondatabase/auth/ui/tailwind';
```

**If NOT using Tailwind:**
```typescript
// In app/layout.tsx
import "@neondatabase/auth/ui/css";
```

**Warning:** Never import both - causes 94KB of duplicate styles.

### 2. Create Provider

Create `app/auth-provider.tsx`:

```tsx
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
      social={{
        providers: ["google", "github"]
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

### 3. Wrap App

Update `app/layout.tsx`:

```tsx
import { AuthProvider } from "./auth-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 4. Create Auth Pages

Create `app/auth/[path]/page.tsx`:

```tsx
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

This creates routes: `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, etc.

---

## Provider Configuration

### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `authClient` | `AuthClient` | Yes | The auth client instance from `createAuthClient()` |
| `navigate` | `(path: string) => void` | Yes | Function to navigate to a new route |
| `replace` | `(path: string) => void` | Yes | Function to replace current route (for redirects) |
| `Link` | `Component` | Yes | Next.js Link component |
| `onSessionChange` | `() => void` | No | Callback fired when authentication state changes |
| `avatar` | `{ upload: (file: File) => Promise<string> }` | No | Avatar upload configuration |
| `social` | `{ providers: string[] }` | No | Social login providers to display |

### Social Login

```tsx
<NeonAuthUIProvider
  social={{
    providers: ["google", "github"]
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
import { AuthView, SignInForm, SignUpForm } from "@neondatabase/auth/react/ui";

// Full auth view (recommended)
<AuthView pathname="sign-in" />

// Individual forms
<SignInForm />
<SignUpForm />
```

### User Components

```tsx
import { UserButton, UserAvatar, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";

function Navbar() {
  return (
    <nav>
      <SignedOut>
        <a href="/auth/sign-in">Sign In</a>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
```

### Protected Routes

```tsx
import { RedirectToSignIn, SignedIn } from "@neondatabase/auth/react/ui";

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
import { AccountView, SettingsCards } from "@neondatabase/auth/react/ui";

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
} from "@neondatabase/auth/react/ui";
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
| Server utilities | `@neondatabase/auth/react/ui/server` |
| CSS | `@neondatabase/auth/ui/css` |
| Tailwind | `@neondatabase/auth/ui/tailwind` |

---

## Related References

- [Setup - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md) - Auth client setup
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns
- [Troubleshooting](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions

---

**Reference Version**: 1.1.0
**Last Updated**: 2025-12-16
