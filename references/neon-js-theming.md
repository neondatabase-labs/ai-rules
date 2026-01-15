# Neon JS SDK - UI Theming

Complete guide to customizing the Neon Auth UI components.

## How It Works

Neon Auth UI **automatically inherits your app's existing theme**. If you already have CSS variables like `--primary`, `--background`, etc. defined (from Tailwind, shadcn/ui, or custom CSS), the auth components will use them with no configuration needed.

**Key features:**
- **Automatic inheritance**: Uses your existing `--primary`, `--background`, etc. variables
- **Fallback defaults**: If you don't define a variable, sensible defaults are used
- **No conflicts**: All auth styles are in `@layer neon-auth`, so your styles always win
- **Import order doesn't matter**: CSS layers handle priority automatically

### Integration with shadcn/ui

If you use shadcn/ui or similar libraries that define `--primary`, `--background`, etc., Neon Auth will automatically inherit those colors. No additional configuration needed.

### Why Variables Are on `:root`

Variables are defined on `:root` to ensure they're accessible to portal-rendered components (modals, dropdowns, toasts) that render outside the normal component tree.

## CSS Import Decision

| Your Setup | Import Path | Bundle Size |
|------------|-------------|-------------|
| No Tailwind | `@neondatabase/neon-js/ui/css` | ~47KB |
| Tailwind v4 | `@neondatabase/neon-js/ui/tailwind` | ~2KB (tokens only) |

**Never import both** - causes duplicate styles (~94KB).

Import order doesn't matter - auth UI styles are wrapped in `@layer neon-auth`, giving your unlayered styles automatic priority.

### Without Tailwind

```typescript
// In layout.tsx or _app.tsx
import "@neondatabase/neon-js/ui/css";
```

### With Tailwind v4

```css
/* globals.css */
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/tailwind';

/* Your theme variables (if any) - auth will inherit these automatically */
```

## Customization Options

### Option 1: Use Your Existing Theme (Recommended)

If you already have theme variables defined, auth components inherit them automatically:

```css
/* Your existing theme - auth uses these automatically */
:root {
  --primary: oklch(0.55 0.25 250);        /* Auth buttons will be blue */
  --primary-foreground: oklch(0.98 0 0);
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... */
}
```

No additional configuration needed!

### Option 2: Auth-Specific Customization

To customize auth components differently from your main app, use the `--neon-*` prefix:

```css
:root {
  /* Your app's primary color */
  --primary: oklch(0.55 0.25 250);  /* Blue */

  /* Override just for auth components */
  --neon-primary: oklch(0.55 0.18 145);  /* Green - only auth uses this */
}
```

### Complete `--neon-*` Variable Reference

| Variable | Inherits From | Default (Light) |
|----------|---------------|-----------------|
| `--neon-primary` | `--primary` | `oklch(0.205 0 0)` |
| `--neon-primary-foreground` | `--primary-foreground` | `oklch(0.985 0 0)` |
| `--neon-secondary` | `--secondary` | `oklch(0.97 0 0)` |
| `--neon-secondary-foreground` | `--secondary-foreground` | `oklch(0.205 0 0)` |
| `--neon-background` | `--background` | `oklch(1 0 0)` |
| `--neon-foreground` | `--foreground` | `oklch(0.145 0 0)` |
| `--neon-muted` | `--muted` | `oklch(0.97 0 0)` |
| `--neon-muted-foreground` | `--muted-foreground` | `oklch(0.556 0 0)` |
| `--neon-accent` | `--accent` | `oklch(0.97 0 0)` |
| `--neon-accent-foreground` | `--accent-foreground` | `oklch(0.205 0 0)` |
| `--neon-destructive` | `--destructive` | `oklch(0.577 0.245 27.325)` |
| `--neon-card` | `--card` | `oklch(1 0 0)` |
| `--neon-card-foreground` | `--card-foreground` | `oklch(0.145 0 0)` |
| `--neon-border` | `--border` | `oklch(0.922 0 0)` |
| `--neon-input` | `--input` | `oklch(0.922 0 0)` |
| `--neon-ring` | `--ring` | `oklch(0.708 0 0)` |
| `--neon-radius` | `--radius` | `0.625rem` |

## Token Pairing Rules

**Always override pairs together** to maintain contrast (min 4.5:1 ratio).

| Background Token | Foreground Token |
|-----------------|------------------|
| `--primary` | `--primary-foreground` |
| `--secondary` | `--secondary-foreground` |
| `--background` | `--foreground` |
| `--muted` | `--muted-foreground` |
| `--accent` | `--accent-foreground` |
| `--destructive` | `--destructive-foreground` |
| `--card` | `--card-foreground` |

If you only define `--primary` without `--primary-foreground`, contrast issues may occur.

## Dark Mode

### Dark Mode Fallback Behavior

If you define a variable in `:root` but not in `.dark`:
- **Light mode**: Uses your value
- **Dark mode**: Uses auth's default dark value

**Recommendation**: If customizing, define both light and dark modes.

### Option 1: next-themes (Recommended for Next.js)

```bash
npm install next-themes
```

```typescript
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```typescript
// components/theme-toggle.tsx
"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

### Option 2: Vanilla JavaScript

```typescript
// Check system preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Apply dark mode
document.documentElement.classList.toggle("dark", prefersDark);

// Toggle manually
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}
```

### Option 3: CSS Only (System Preference)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    /* ... other dark tokens */
  }
}
```

## OKLCH Color Format

Neon Auth UI uses OKLCH for perceptually uniform colors.

**Format:** `oklch(L C H)` or `oklch(L C H / alpha)`

| Parameter | Range | Description |
|-----------|-------|-------------|
| L (Lightness) | 0-1 | 0 = black, 1 = white |
| C (Chroma) | 0-0.4 | 0 = gray, higher = more vivid |
| H (Hue) | 0-360 | Color wheel degrees |
| alpha | 0-1 or 0%-100% | Opacity |

**Examples:**

```css
--primary: oklch(0.55 0.25 250);        /* Vivid blue */
--primary: oklch(0.55 0.25 250 / 50%);  /* 50% opacity */
--muted: oklch(0.5 0 0);                /* Neutral gray (no chroma) */
```

**Convert HEX/RGB to OKLCH:** https://oklch.com

## Component-Specific Styling

All UI components accept `classNames` props for targeted customization:

```typescript
import { SignInForm } from "@neondatabase/neon-js/auth/react/ui";

<SignInForm
  className="mx-auto max-w-md"
  classNames={{
    card: "border-primary/20",
    button: "rounded-full",
    input: "bg-muted/50",
  }}
/>
```

### Available classNames Interfaces

- `AuthViewClassNames` - Main auth view container
- `AuthFormClassNames` - Form wrapper and fields
- `UserAvatarClassNames` - Avatar component
- `UserButtonClassNames` - User dropdown button
- `SettingsCardClassNames` - Settings panels

## Common Theming Mistakes

### 1. Importing Both CSS Paths

```css
/* Wrong - duplicate styles, ~94KB */
@import '@neondatabase/neon-js/ui/css';
@import '@neondatabase/neon-js/ui/tailwind';

/* Correct - pick one */
@import '@neondatabase/neon-js/ui/css';
```

### 2. Missing Foreground Pairs

```css
/* Wrong - white text on light background */
:root {
  --primary: oklch(0.9 0.1 250);
}

/* Correct - ensure contrast */
:root {
  --primary: oklch(0.9 0.1 250);
  --primary-foreground: oklch(0.1 0 0);
}
```

### 3. Using HEX/RGB Instead of OKLCH

```css
/* Works but may not match perfectly */
:root {
  --primary: #3b82f6;
}

/* Recommended - use OKLCH format */
:root {
  --primary: oklch(0.59 0.2 262);
}
```

### 4. Forgetting Dark Mode Tokens

```css
/* Wrong - light mode only */
:root {
  --primary: oklch(0.55 0.25 250);
  --primary-foreground: oklch(0.98 0 0);
}

/* Correct - both modes */
:root {
  --primary: oklch(0.55 0.25 250);
  --primary-foreground: oklch(0.98 0 0);
}
.dark {
  --primary: oklch(0.75 0.2 250);
  --primary-foreground: oklch(0.1 0 0);
}
```

## Brand Color Examples

### Blue Theme

```css
:root {
  --primary: oklch(0.59 0.2 262);
  --primary-foreground: oklch(0.98 0 0);
}
.dark {
  --primary: oklch(0.7 0.18 262);
  --primary-foreground: oklch(0.1 0 0);
}
```

### Green Theme

```css
:root {
  --primary: oklch(0.55 0.18 145);
  --primary-foreground: oklch(0.98 0 0);
}
.dark {
  --primary: oklch(0.7 0.16 145);
  --primary-foreground: oklch(0.1 0 0);
}
```

### Purple Theme

```css
:root {
  --primary: oklch(0.55 0.22 300);
  --primary-foreground: oklch(0.98 0 0);
}
.dark {
  --primary: oklch(0.7 0.2 300);
  --primary-foreground: oklch(0.1 0 0);
}
```
