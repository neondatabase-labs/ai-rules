# Neon JS SDK Setup Guide

> **Complete Walkthrough**: This is a self-contained, step-by-step guide with numbered phases.
> Follow each phase in order for a full Neon JS SDK setup with auth and data API.

Complete guide for setting up the Neon JS SDK with authentication and PostgREST-style database queries.

### Important:
- Remember to run the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-js" after completing the guide.
- This guide extends the Neon Auth setup. Follow phases 1-4 from the appropriate framework-specific setup guide ([Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md), [React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-react-spa.md), or [Node.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nodejs.md)), then continue with the data API phases below.

## Table of Contents

- [Workflow Checklist](#workflow-checklist)
- [Phase 1-4: Auth Setup](#phase-1-4-auth-setup)
- [Phase 5: Database Client Configuration](#phase-5-database-client-configuration)
- [Phase 6: Type Generation (Optional)](#phase-6-type-generation-optional)
- [Phase 7: UI Setup (Optional)](#phase-7-ui-setup-optional)
- [Phase 8: Validation & Testing](#phase-8-validation--testing)
- [Phase 9: Add Best Practices References](#phase-9-add-best-practices-references)

---

## Workflow Checklist

When following this guide, I will track these high-level tasks:

- [ ] Detect project context (package manager, framework, existing setup)
- [ ] Install @neondatabase/neon-js package
- [ ] Configure environment variables (auth URL + data API URL)
- [ ] Set up auth client (follow Neon Auth guide phases 1-4)
- [ ] Set up database client for queries
- [ ] (Optional) Generate TypeScript types from database
- [ ] (Optional) Set up UI provider
- [ ] Validate setup and test queries
- [ ] Add Neon JS best practices to project docs

---

## Phase 1-4: Auth Setup

**Follow the Neon Auth setup guide first:**

See the appropriate framework-specific setup guide for phases 1-4:
- [Next.js Setup](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md)
- [React SPA Setup](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-react-spa.md)
- [Node.js Setup](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nodejs.md)

Phases overview:
- Phase 1: Context Detection
- Phase 2: Installation (use `@neondatabase/neon-js` instead of `@neondatabase/auth`)
- Phase 3: Environment Configuration (add `NEON_DATA_API_URL`)
- Phase 4: Framework-Specific Setup (use `@neondatabase/neon-js` imports)

**Key differences:**
- Install `@neondatabase/neon-js` instead of `@neondatabase/auth`
- Import from `@neondatabase/neon-js/auth/next` instead of `@neondatabase/auth/next`
- Add `NEON_DATA_API_URL` environment variable

---

## Phase 5: Database Client Configuration

**Outcome**: A working database client for PostgREST-style queries.

### Next.js

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

**Environment Variables:**

Add to `.env.local`:
```bash
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
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

### React SPA

**Update `src/lib/auth-client.ts` to include database:**

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

// Export auth and database separately for convenience
export const authClient = client.auth;
export const dbClient = client;
```

**Environment Variables:**

Add to `.env`:
```bash
VITE_NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**Usage:**

```typescript
import { dbClient } from "./lib/auth-client";

// Use in components
const { data, error } = await dbClient.from("items").select();
```

### Node.js Backend

**Update client to include database:**

```typescript
import { createClient } from "@neondatabase/neon-js";

export const client = createClient({
  auth: { url: process.env.NEON_AUTH_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});

// Use in routes
await client.auth.signIn.email({ email, password });
const { data } = await client.from("users").select();
```

**Environment Variables:**

Add to `.env`:
```bash
NEON_DATA_API_URL=https://ep-xxx.apirest.c-2.us-east-2.aws.neon.build/dbname/rest/v1
```

**Complete reference:** See [Data API Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#client-setup)

---

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

**Benefits:** Full TypeScript autocomplete for tables, columns, and relationships.

**Complete reference:** See [Data API Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#type-generation)

---

## Phase 7: UI Setup (Optional)

Skip this phase if using custom auth forms or you already set up UI with neon-auth skill.

**Complete UI setup:** See [UI - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-nextjs.md) or [UI - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-react-spa.md)

**Quick summary:**

1. **Import CSS** (choose ONE method):
   - With Tailwind: `@import '@neondatabase/neon-js/ui/tailwind';` in CSS file
   - Without Tailwind: `import "@neondatabase/neon-js/ui/css";` in layout/app file

2. **Create Auth Provider** with framework-specific navigation adapters

3. **Wrap app** in the provider

**Framework-specific examples:** See [UI - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-nextjs.md) or [UI - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-react-spa.md)

---

## Phase 8: Validation & Testing

### Test Database Queries

Create a test page or API route:

```typescript
// app/api/test-db/route.ts (Next.js)
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

### Manual Testing Checklist

- [ ] Auth: Sign up a test user
- [ ] Auth: Sign in with test user
- [ ] Auth: Verify session persists
- [ ] Data: Query returns results
- [ ] Data: Insert creates records
- [ ] Data: Update modifies records
- [ ] Data: Delete removes records

**Having Issues?** See:
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md)
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md)
- [Data API Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md#error-handling)

---

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

**Complete query reference:** See [Data API Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md)

**Next Steps:**
- Add protected routes using session checks
- Implement Row Level Security (RLS) for data access control
- Generate types from schema for full TypeScript support

**Reference Documentation:**

*Framework-Specific:*
- [Setup - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md) | [UI - Next.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-nextjs.md)
- [Setup - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-react-spa.md) | [UI - React SPA](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-react-spa.md)
- [Setup - Node.js](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nodejs.md)

*Shared:*
- [Data API Reference](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-js-data-api.md) - PostgREST query patterns
- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, adapter patterns

---

**Guide Version**: 1.0.0  
**Last Updated**: 2025-12-09
