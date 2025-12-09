# Neon JS SDK - UI Theming

Complete guide to customizing the Neon Auth UI components.

## CSS Import Decision

| Your Setup | Import Path | Bundle Size |
|------------|-------------|-------------|
| No Tailwind | `@neondatabase/neon-js/ui/css` | ~47KB |
| Tailwind v4 | `@neondatabase/neon-js/ui/tailwind` | ~2KB (tokens only) |

**Never import both** - causes duplicate styles (~94KB).

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

/* Your overrides go here */
```

## Theme Tokens

Override in `:root` (light) and `.dark` (dark mode).

### Core Colors

```css
:root {
  /* Primary - buttons, links, focus rings */
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);

  /* Secondary - secondary buttons */
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);

  /* Background/Foreground - page colors */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);

  /* Muted - placeholders, disabled states */
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);

  /* Accent - hover states */
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);

  /* Destructive - errors, delete actions */
  --destructive: oklch(0.577 0.245 27.325);

  /* UI Elements */
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}
```

### Token Pairing Rules

**Always override pairs together** to maintain contrast (min 4.5:1 ratio).

| Background Token | Foreground Token |
|-----------------|------------------|
| `--primary` | `--primary-foreground` |
| `--secondary` | `--secondary-foreground` |
| `--background` | `--foreground` |
| `--muted` | `--muted-foreground` |
| `--accent` | `--accent-foreground` |
| `--destructive` | `--destructive-foreground` |

### Additional Tokens

```css
:root {
  /* Cards and Popovers */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* Border Radius Scale */
  --radius: 0.625rem;           /* Base (10px) */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Sidebar (if using sidebar components) */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
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

## Dark Mode Implementation

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
/* Wrong - may not work correctly */
:root {
  --primary: #3b82f6;
}

/* Correct - use OKLCH format */
:root {
  --primary: oklch(0.59 0.2 262);
}
```

### 4. Wrong CSS Import Order

```css
/* Wrong - overrides load before Neon CSS */
@import './my-overrides.css';
@import '@neondatabase/neon-js/ui/css';

/* Correct - Neon CSS first, then overrides */
@import '@neondatabase/neon-js/ui/css';
@import './my-overrides.css';
```

### 5. Forgetting Dark Mode Tokens

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
