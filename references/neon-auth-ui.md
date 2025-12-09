# Neon Auth UI Components Reference

Complete reference for all UI components and provider configuration in `@neondatabase/auth` and `@neondatabase/neon-js`.

## Table of Contents

- [Import Paths](#import-paths)
- [Provider Setup](#provider-setup)
  - [Next.js App Router](#nextjs-app-router-provider-setup)
  - [React SPA (Vite, CRA)](#react-spa-provider-setup)
  - [TanStack Router](#tanstack-router-provider-setup)
- [CSS Import Strategy](#css-import-strategy)
- [UI Components](#ui-components)
  - [Authentication Views](#authentication-views)
  - [User Components](#user-components)
  - [Conditional Rendering](#conditional-rendering)
  - [Protected Routes](#protected-routes)
  - [Account/Settings Views](#accountsettings-views)
- [Provider Configuration](#provider-configuration)
  - [Props Reference](#props-reference)
  - [Avatar Upload](#avatar-upload-configuration)
  - [Social Login](#social-login-configuration)
  - [Localization](#localization)
  - [Session Change Handling](#session-change-handling)

---

## Import Paths

| What | `@neondatabase/auth` | `@neondatabase/neon-js` |
|------|---------------------|------------------------|
| Auth client | `@neondatabase/auth` | `@neondatabase/neon-js` |
| React adapter | `@neondatabase/auth/react/adapters` | `@neondatabase/neon-js/auth/react/adapters` |
| UI components | `@neondatabase/auth/react/ui` | `@neondatabase/neon-js/auth/react/ui` |
| Server utilities | `@neondatabase/auth/react/ui/server` | `@neondatabase/neon-js/auth/react/ui/server` |
| CSS | `@neondatabase/auth/ui/css` | `@neondatabase/neon-js/ui/css` |
| Tailwind | `@neondatabase/auth/ui/tailwind` | `@neondatabase/neon-js/ui/tailwind` |

---

## Provider Setup

### Next.js App Router Provider Setup

**1. Import CSS**

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

**2. Create Provider**

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

**3. Wrap App**

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

**4. Create Auth Pages (Optional)**

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
  return <AuthView path={path} />;
}
```

This creates routes: `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, etc.

---

### React SPA Provider Setup

**1. Install Dependencies**

```bash
npm install react-router-dom
```

**2. Import CSS**

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

**3. Update main.tsx with BrowserRouter**

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

**4. Create Provider**

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

**5. Add Routes**

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

export default function App() {
  return (
    <Routes>
      <Route path="/auth/:pathname" element={<AuthPage />} />
      {/* ... other routes */}
    </Routes>
  );
}
```

---

### TanStack Router Provider Setup

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

## CSS Import Strategy

**CRITICAL:** Choose ONE import method. Never import both - it causes duplicate styles.

**Check if the project uses Tailwind CSS** by looking for:
- `tailwind.config.js` or `tailwind.config.ts` in the project root
- `@import 'tailwindcss'` or `@tailwind` directives in CSS files
- `tailwindcss` in package.json dependencies

**If using Tailwind CSS v4:**
```css
@import 'tailwindcss';
@import '@neondatabase/auth/ui/tailwind';
```

**If NOT using Tailwind:**
```typescript
import "@neondatabase/auth/ui/css";
```

### CSS Variables Reference

**IMPORTANT:** The UI package already includes all necessary CSS variables. Do NOT copy these into your own CSS file.

**ALWAYS use these CSS variables** when creating custom components to ensure:
- Visual consistency with auth components
- Automatic dark mode support
- Proper theming integration

| Variable | Purpose | Usage |
|----------|---------|-------|
| `--background`, `--foreground` | Page background/text | `hsl(var(--background))` |
| `--card`, `--card-foreground` | Card surfaces | `hsl(var(--card))` |
| `--primary`, `--primary-foreground` | Primary buttons/actions | `hsl(var(--primary))` |
| `--secondary`, `--secondary-foreground` | Secondary elements | `hsl(var(--secondary))` |
| `--muted`, `--muted-foreground` | Muted/subtle elements | `hsl(var(--muted))` |
| `--destructive` | Destructive/danger actions | `hsl(var(--destructive))` |
| `--border`, `--input`, `--ring` | Borders and focus rings | `hsl(var(--border))` |
| `--radius` | Border radius | `var(--radius)` |

**Dark mode:** Add the `dark` class to `<html>` or `<body>` to enable it. All CSS variable values automatically adjust.

---

## UI Components

### Authentication Views

#### AuthView

Full auth view that handles routing between sign-in, sign-up, forgot-password, etc.

```tsx
import { AuthView } from "@neondatabase/auth/react/ui";

// Use with dynamic routing
function AuthPage() {
  const { pathname } = useParams();
  return <AuthView pathname={pathname} />;
}

// Or with static path
<AuthView pathname="sign-in" />
```

**Props:**
- `pathname`: The auth view to render (`"sign-in"`, `"sign-up"`, `"forgot-password"`, `"reset-password"`, `"magic-link"`, `"two-factor"`, `"callback"`, `"sign-out"`)

#### Individual Forms

Embed individual auth forms anywhere in your app:

```tsx
import { SignInForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm } from "@neondatabase/auth/react/ui";

<SignInForm />
<SignUpForm />
<ForgotPasswordForm />
<ResetPasswordForm />
```

---

### User Components

#### UserButton

Dropdown button showing user avatar with menu for settings and sign out.

```tsx
import { UserButton } from "@neondatabase/auth/react/ui";

<UserButton />
```

The dropdown includes:
- User name and email
- Link to account settings
- Sign out button

#### UserAvatar

Just the user's avatar image.

```tsx
import { UserAvatar } from "@neondatabase/auth/react/ui";

<UserAvatar />
```

---

### Conditional Rendering

#### SignedIn

Render children only when user is authenticated.

```tsx
import { SignedIn } from "@neondatabase/auth/react/ui";

<SignedIn>
  <p>Welcome back!</p>
  <UserButton />
</SignedIn>
```

#### SignedOut

Render children only when user is NOT authenticated.

```tsx
import { SignedOut } from "@neondatabase/auth/react/ui";

<SignedOut>
  <a href="/auth/sign-in">Sign In</a>
</SignedOut>
```

#### AuthLoading

Render children while auth state is being determined.

```tsx
import { AuthLoading } from "@neondatabase/auth/react/ui";

<AuthLoading>
  <p>Loading...</p>
</AuthLoading>
```

#### Combined Usage

```tsx
import { SignedIn, SignedOut, AuthLoading, UserButton } from "@neondatabase/auth/react/ui";

function AuthStatus() {
  return (
    <>
      <AuthLoading>
        <span>Loading...</span>
      </AuthLoading>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <a href="/auth/sign-in">Sign In</a>
      </SignedOut>
    </>
  );
}
```

---

### Protected Routes

#### RedirectToSignIn

Automatically redirect unauthenticated users to sign-in page.

```tsx
import { RedirectToSignIn, SignedIn } from "@neondatabase/auth/react/ui";

function ProtectedPage() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <p>This content is only visible to authenticated users.</p>
      </SignedIn>
    </>
  );
}
```

---

### Account/Settings Views

#### AccountView

Full account settings view with navigation between different settings sections.

```tsx
import { AccountView } from "@neondatabase/auth/react/ui";

function AccountPage() {
  const { pathname } = useParams();
  return <AccountView pathname={pathname} />;
}
```

**Available pathnames:**
- `"settings"` - Profile settings (name, avatar, email)
- `"security"` - Password and 2FA settings
- `"sessions"` - Active sessions management

#### SettingsCards

Render all settings cards together (alternative to AccountView).

```tsx
import { SettingsCards } from "@neondatabase/auth/react/ui";

<SettingsCards />
```

#### Individual Settings Cards

Build custom settings pages by using individual cards:

```tsx
import {
  UpdateAvatarCard,
  UpdateNameCard,
  ChangeEmailCard,
  ChangePasswordCard,
  SessionsCard,
  DeleteAccountCard
} from "@neondatabase/auth/react/ui";

function CustomSettingsPage() {
  return (
    <div className="space-y-4">
      <UpdateAvatarCard />
      <UpdateNameCard />
      <ChangeEmailCard />
      <ChangePasswordCard />
      <SessionsCard />
      <DeleteAccountCard />
    </div>
  );
}
```

| Card | Description |
|------|-------------|
| `UpdateAvatarCard` | Upload/change profile picture |
| `UpdateNameCard` | Change display name |
| `ChangeEmailCard` | Update email address |
| `ChangePasswordCard` | Change password |
| `SessionsCard` | View and revoke active sessions |
| `DeleteAccountCard` | Permanently delete account |

---

## Provider Configuration

### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `authClient` | `AuthClient` | Yes | The auth client instance from `createAuthClient()` |
| `navigate` | `(path: string) => void` | Yes | Function to navigate to a new route |
| `replace` | `(path: string) => void` | Yes | Function to replace current route (for redirects) |
| `Link` | `Component` | Yes | Link component adapter for your framework |
| `onSessionChange` | `() => void` | No | Callback fired when authentication state changes |
| `avatar` | `{ upload: (file: File) => Promise<string> }` | No | Avatar upload configuration |
| `social` | `{ providers: string[] }` | No | Social login providers to display |
| `localization` | `object` | No | UI text overrides |

---

### Avatar Upload Configuration

Enable users to upload profile pictures:

```tsx
<NeonAuthUIProvider
  avatar={{
    upload: async (file: File) => {
      // Example: Upload to your own API
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const { url } = await response.json();
      return url; // Return the public URL
    },
  }}
>
```

**Example: Upload to Cloudinary**

```tsx
avatar={{
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset");
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
      { method: "POST", body: formData }
    );
    
    const data = await response.json();
    return data.secure_url;
  },
}}
```

**Example: Upload to S3 (presigned URL)**

```tsx
avatar={{
  upload: async (file) => {
    const { uploadUrl, publicUrl } = await fetch("/api/get-upload-url", {
      method: "POST",
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    }).then(r => r.json());
    
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    
    return publicUrl;
  },
}}
```

---

### Social Login Configuration

Configure which social login buttons to display:

```tsx
<NeonAuthUIProvider
  social={{
    providers: ["google", "github"]
  }}
>
```

**Available providers:**
- `"google"` - Google OAuth
- `"github"` - GitHub OAuth

**Note:** Social providers must be configured in your Neon dashboard. Google and GitHub are enabled by default.

**Hide social login:**
```tsx
social={{
  providers: []
}}
```

---

### Localization

Customize UI text for different languages or branding:

```tsx
<NeonAuthUIProvider
  localization={{
    signIn: "Log In",
    signUp: "Create Account",
    signInTitle: "Welcome back",
    signInDescription: "Enter your credentials to continue",
    email: "Email address",
    password: "Password",
    submit: "Continue",
    continueWithGoogle: "Continue with Google",
    continueWithGithub: "Continue with GitHub",
    // ... many more strings available
  }}
>
```

---

### Session Change Handling

The `onSessionChange` callback is fired when:
- User signs in
- User signs out
- Session is refreshed
- Session expires

**Common use cases:**

**Refetch Server Data (Next.js):**
```tsx
onSessionChange={() => router.refresh()}
```

**Invalidate TanStack Query Cache:**
```tsx
const queryClient = useQueryClient();

onSessionChange={() => {
  queryClient.invalidateQueries();
}}
```

**Update Global State:**
```tsx
onSessionChange={() => {
  resetAppState();
  refetchUserData();
}}
```

---

## Complete Import Example

```tsx
// All commonly used components
import {
  // Views
  AuthView,
  AccountView,
  
  // Forms
  SignInForm,
  SignUpForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  
  // User
  UserButton,
  UserAvatar,
  
  // Conditional
  SignedIn,
  SignedOut,
  AuthLoading,
  RedirectToSignIn,
  
  // Settings
  SettingsCards,
  UpdateAvatarCard,
  UpdateNameCard,
  ChangeEmailCard,
  ChangePasswordCard,
  SessionsCard,
  DeleteAccountCard,
} from "@neondatabase/auth/react/ui";

// Server utilities (Next.js)
import { authViewPaths } from "@neondatabase/auth/react/ui/server";
```

---

## Related References

- [Setup Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup.md) - Complete setup guide for all frameworks
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns
- [Code Generation Rules](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/code-generation-rules.md) - CSS import strategies

---

**Reference Version**: 1.0.0  
**Last Updated**: 2025-12-09
