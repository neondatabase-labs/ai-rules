# Neon JS SDK - Import Reference

Complete import paths for all `@neondatabase` packages.

## @neondatabase/neon-js (Full SDK)

### Main Entry

```typescript
import {
  createClient,
  SupabaseAuthAdapter,
  BetterAuthVanillaAdapter
} from "@neondatabase/neon-js";
```

### Auth Subpaths

```typescript
// Next.js integration
import { authApiHandler, createAuthClient, neonAuth } from "@neondatabase/neon-js/auth/next";

// React adapters (NOT from main entry)
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

// Vanilla adapters (also available from main entry)
import { BetterAuthVanillaAdapter, SupabaseAuthAdapter } from "@neondatabase/neon-js/auth/vanilla/adapters";
```

### UI Components

```typescript
// React UI components
import {
  NeonAuthUIProvider,
  AuthView,
  SignInForm,
  SignUpForm,
  UserButton,
  UserAvatar,
  ForgotPasswordForm,
  ResetPasswordForm,
  MagicLinkForm,
  TwoFactorForm,
  SettingsCard
} from "@neondatabase/neon-js/auth/react/ui";

// Server utilities (for Next.js page generation)
import { authViewPaths } from "@neondatabase/neon-js/auth/react/ui/server";
```

### UI CSS

```typescript
// Without Tailwind - pre-built CSS bundle (~47KB)
import "@neondatabase/neon-js/ui/css";
```

```css
/* With Tailwind v4 - token definitions only (~2KB) */
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/tailwind';
```

**Never import both** - causes duplicate styles.

## @neondatabase/auth (Auth Only)

Smaller bundle when you don't need database queries.

### Main Entry

```typescript
import { createAuthClient } from "@neondatabase/auth";
```

### Adapters

```typescript
// React adapter (NOT from main entry)
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

// Vanilla adapters
import { BetterAuthVanillaAdapter, SupabaseAuthAdapter } from "@neondatabase/auth/vanilla/adapters";
```

### Next.js Integration

```typescript
import { authApiHandler, createAuthClient, neonAuth } from "@neondatabase/auth/next";
```

### UI Components

```typescript
import { NeonAuthUIProvider, AuthView, SignInForm } from "@neondatabase/auth/react/ui";
import { authViewPaths } from "@neondatabase/auth/react/ui/server";
```

### UI CSS

```typescript
import "@neondatabase/auth/ui/css";
```

## @neondatabase/postgrest-js (Data Only)

Use when bringing your own authentication.

```typescript
import { NeonPostgrestClient, fetchWithToken } from "@neondatabase/postgrest-js";

const client = new NeonPostgrestClient({
  dataApiUrl: process.env.NEON_DATA_API_URL!,
  options: {
    global: {
      fetch: fetchWithToken(async () => getTokenFromYourAuthSystem()),
    },
  },
});
```

## Import Rules Summary

| Export | Main Entry | Subpath Required |
|--------|------------|------------------|
| `createClient` | Yes | No |
| `SupabaseAuthAdapter` | Yes | No |
| `BetterAuthVanillaAdapter` | Yes | No |
| `BetterAuthReactAdapter` | **No** | `auth/react/adapters` |
| `createAuthClient` (Next.js) | **No** | `auth/next` |
| `authApiHandler` | **No** | `auth/next` |
| `NeonAuthUIProvider` | **No** | `auth/react/ui` |
| UI CSS | **No** | `ui/css` or `ui/tailwind` |

## Common Import Mistakes

### Wrong: BetterAuthReactAdapter from main

```typescript
// This will NOT work
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";
```

### Correct: BetterAuthReactAdapter from subpath

```typescript
// This works
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";
```

### Wrong: Both CSS imports

```css
/* Causes ~94KB of duplicate styles */
@import '@neondatabase/neon-js/ui/css';
@import '@neondatabase/neon-js/ui/tailwind';
```

### Correct: One CSS import

```css
/* Without Tailwind */
@import '@neondatabase/neon-js/ui/css';

/* OR with Tailwind v4 */
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/tailwind';
```
