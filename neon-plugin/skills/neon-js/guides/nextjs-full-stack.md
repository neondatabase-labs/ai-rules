# Next.js Full Stack Setup

> **Complete Walkthrough**: This is a self-contained, step-by-step guide with its own numbered phases (Phase 1-9).
> Follow each phase in order for a full Neon JS SDK setup with auth and data API in Next.js App Router.

Complete guide for setting up the Neon JS SDK with authentication and PostgREST-style database queries.

### Important:
- Remember to run the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-js" after completing the guide.

## Table of Contents

- [Next.js Full Stack Setup](#nextjs-full-stack-setup)
    - [Important:](#important)
  - [Table of Contents](#table-of-contents)
  - [Workflow Checklist](#workflow-checklist)
  - [Phase 1: Context Detection](#phase-1-context-detection)
  - [Phase 2: Installation](#phase-2-installation)
  - [Phase 3: Environment Configuration](#phase-3-environment-configuration)
  - [Phase 4: API Route Setup](#phase-4-api-route-setup)
  - [Phase 5: Unified Client Configuration](#phase-5-unified-client-configuration)
    - [5.1. Auth Client (Client-Side)](#51-auth-client-client-side)
    - [5.2. Database Client (Server + Client)](#52-database-client-server--client)
  - [Phase 6: Type Generation (Optional)](#phase-6-type-generation-optional)
  - [Phase 7: UI Setup (Optional)](#phase-7-ui-setup-optional)
    - [7.1. Import CSS](#71-import-css)
    - [7.2. Create Auth Provider](#72-create-auth-provider)
  - [Phase 8: Validation & Testing](#phase-8-validation--testing)
    - [8.1. Test Database Queries](#81-test-database-queries)
  - [Phase 9: Add Best Practices References](#phase-9-add-best-practices-references)

---

## Workflow Checklist

When following this guide, I will track these high-level tasks:

- [ ] Detect project context (package manager, Next.js version, existing setup)
- [ ] Install @neondatabase/neon-js package
- [ ] Configure environment variables (auth URL + data API URL)
- [ ] Create API route handler at /api/auth/[...path]
- [ ] Set up auth client for client components
- [ ] Set up database client for queries
- [ ] (Optional) Generate TypeScript types from database
- [ ] (Optional) Set up UI provider
- [ ] Validate setup and test queries
- [ ] Add Neon JS best practices to project docs

---

## Phase 1: Context Detection

Auto-detect project context:

**Check Package Manager:**
```bash
ls package-lock.json  # -> npm
ls bun.lockb          # -> bun
ls pnpm-lock.yaml     # -> pnpm
ls yarn.lock          # -> yarn
```

**Check Next.js Version:**
```bash
grep '"next"' package.json
```
Ensure Next.js 13+ with App Router (pages in `app/` directory).

**Check Existing Setup:**
```bash
ls app/api/auth        # Auth routes exist?
ls lib/db              # DB client exists?
grep '@neondatabase' package.json  # Already installed?
```

**Check for Tailwind:**
```bash
ls tailwind.config.js tailwind.config.ts 2>/dev/null
```

## Phase 2: Installation

Based on detection, install the full SDK:

```bash
[package-manager] add @neondatabase/neon-js
```

Replace `[package-manager]` with your detected package manager (npm install, pnpm add, yarn add, bun add).

## Phase 3: Environment Configuration

**Outcome**: A working `.env.local` file with both auth URL and data API URL.

Create or update `.env.local`:

```bash
# Neon Auth URL - for authentication
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth

# Neon Data API URL - for database queries
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**Where to find these URLs:**
1. Go to your Neon project dashboard
2. Auth URL: Navigate to "Auth" tab
3. Data API URL: Navigate to "Data API" tab (enable if not already)

**Important:**
- `NEON_AUTH_BASE_URL` - Server-side auth
- `NEXT_PUBLIC_NEON_AUTH_URL` - Client-side auth (NEXT_PUBLIC_ prefix)
- `NEON_DATA_API_URL` - Database queries (server-side only for security)

Add to `.gitignore` if not already present:
```
.env.local
```

## Phase 4: API Route Setup

Create the API route handler for authentication endpoints:

**Create file:** `app/api/auth/[...path]/route.ts`

```typescript
import { authApiHandler } from "@neondatabase/neon-js/auth/next";

export const { GET, POST } = authApiHandler();
```

This creates all authentication endpoints (sign-in, sign-up, sign-out, session, OAuth callbacks).

## Phase 5: Unified Client Configuration

### 5.1. Auth Client (Client-Side)

**Create file:** `lib/auth/client.ts`

```typescript
"use client";

import { createAuthClient } from "@neondatabase/neon-js/auth/next";

export const authClient = createAuthClient();
```

### 5.2. Database Client (Server + Client)

**Create file:** `lib/db/client.ts`

```typescript
import { createClient } from "@neondatabase/neon-js";
import type { Database } from "./database.types"; // Generated types (optional)

/**
 * Database client for PostgREST-style queries.
 * Can be used in server components, API routes, and server actions.
 */
export const dbClient = createClient<Database>({
  auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

**Usage in Server Components:**

```typescript
// app/posts/page.tsx
import { dbClient } from "@/lib/db/client";

export default async function PostsPage() {
  const { data: posts, error } = await dbClient
    .from("posts")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error) return <div>Error loading posts</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Usage in API Routes:**

```typescript
// app/api/posts/route.ts
import { dbClient } from "@/lib/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await dbClient.from("posts").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await dbClient
    .from("posts")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
```

## Phase 6: Type Generation (Optional)

Generate TypeScript types from your database schema:

```bash
npx neon-js gen-types --db-url "postgresql://user:pass@host/db" --output src/types/database.ts
```

Or using environment variable:

```bash
npx neon-js gen-types --db-url "$DATABASE_URL" --output lib/db/database.types.ts
```

Then update your client to use the types:

```typescript
import { createClient } from "@neondatabase/neon-js";
import type { Database } from "./database.types";

export const dbClient = createClient<Database>({
  auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

## Phase 7: UI Setup (Optional)

Skip this phase if using custom auth forms or you already set up UI with neon-auth skill.

### 7.1. Import CSS

**If using Tailwind:**
```css
/* In app/globals.css */
@import '@neondatabase/neon-js/ui/tailwind';
```

**If NOT using Tailwind:**
```typescript
// In app/layout.tsx
import "@neondatabase/neon-js/ui/css";
```

### 7.2. Create Auth Provider

**Create file:** `app/auth-provider.tsx`

```typescript
"use client";

import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";
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
      social={{ providers: ["google", "github"] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

Wrap your app in `app/layout.tsx`:

```typescript
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

## Phase 8: Validation & Testing

### 8.1. Test Database Queries

Create a test page or API route:

```typescript
// app/api/test-db/route.ts
import { dbClient } from "@/lib/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test a simple query
    const { data, error } = await dbClient
      .from("pg_catalog.pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .limit(5);

    if (error) throw error;

    return NextResponse.json({
      status: "connected",
      tables: data,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
```

Visit `/api/test-db` to verify the connection.

**Manual Testing Checklist:**
- [ ] Auth: Sign up a test user
- [ ] Auth: Sign in with test user
- [ ] Auth: Verify session persists
- [ ] Data: Query returns results
- [ ] Data: Insert creates records
- [ ] Data: Update modifies records

## Phase 9: Add Best Practices References

Before executing the add-neon-docs skill, provide a summary:

"Neon JS SDK integration is complete! Now adding documentation references..."

Then execute the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-js"

---

## Setup Complete!

Your Neon JS SDK integration is ready to use.

**What's working:**
- Authentication API routes at `/api/auth/*`
- Client-side auth hooks via `authClient.useSession()`
- PostgREST-style database queries via `dbClient.from()`
- (If configured) Pre-built UI components
- (If configured) TypeScript types for database

**Query Examples:**

```typescript
// Select with filters
const { data } = await dbClient
  .from("items")
  .select("id, name, status")
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(10);

// Select with relationships
const { data } = await dbClient
  .from("posts")
  .select("id, title, author:users(name, email)");

// Insert
const { data, error } = await dbClient
  .from("items")
  .insert({ name: "New Item", status: "pending" })
  .select()
  .single();

// Update
await dbClient
  .from("items")
  .update({ status: "completed" })
  .eq("id", 1);

// Delete
await dbClient
  .from("items")
  .delete()
  .eq("id", 1);
```

**Next Steps:**
- Add protected routes using session checks
- Create relationships between your tables and users_sync
- Implement Row Level Security (RLS) for data access control
