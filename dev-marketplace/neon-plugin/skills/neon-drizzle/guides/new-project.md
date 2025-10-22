# New Project Setup

Complete guide for setting up Drizzle ORM with Neon from scratch.

## Phase 1: Context Detection

Auto-detect project context:

**Check Package Manager:**
```bash
ls package-lock.json  # → npm
ls bun.lockb          # → bun
ls pnpm-lock.yaml     # → pnpm
ls yarn.lock          # → yarn
```

**Check Framework:**
```bash
grep '"next"' package.json      # → Next.js
grep '"express"' package.json   # → Express
grep '"vite"' package.json      # → Vite
```

**Check Existing Setup:**
```bash
ls drizzle.config.ts   # Already configured?
ls src/db/schema.ts    # Schema exists?
```

**Check Environment Files:**
```bash
ls .env .env.local .env.production
```

## Phase 2: Installation

Based on detection, install dependencies:

**For Vercel/Edge Environments (Next.js, Vite on Vercel):**
```bash
[package-manager] add drizzle-orm @neondatabase/serverless
[package-manager] add -D drizzle-kit dotenv @vercel/node
```

**For Node.js Servers (Express, Fastify, standard Node):**
```bash
[package-manager] add drizzle-orm @neondatabase/serverless ws
[package-manager] add -D drizzle-kit dotenv @types/ws
```

## Phase 3: Configuration

Create configuration files in dependency order:

### 3.1. Environment File

Create `.env.local` (or `.env` for non-Next.js):
```bash
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

**Important:** Add to `.gitignore` immediately:
```bash
echo ".env.local" >> .gitignore
```

### 3.2. Drizzle Config

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Key Point:** Always include `config({ path: '.env.local' })` to prevent migration errors.

### 3.3. Database Connection

Create `src/db/index.ts` with appropriate adapter (see `references/adapters.md` for decision guide):

**For Vercel/Edge:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

**For Node.js:**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
```

See `templates/db-http.ts` and `templates/db-websocket.ts` for complete examples.

## Phase 4: Schema Generation

Based on app type, create appropriate schema:

### 4.1. Common Patterns

**Todo App:**
```typescript
import { pgTable, serial, text, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Blog App:**
```typescript
import { pgTable, serial, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('posts_user_id_idx').on(table.userId),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
```

See `templates/schema-example.ts` for more complex examples.

## Phase 5: Migrations

Run migrations with proper error handling:

### 5.1. Generate Migration

```bash
[package-manager] drizzle-kit generate
```

This creates SQL files in `src/db/migrations/`.

### 5.2. Apply Migration

**Recommended approach (explicit env loading):**
```bash
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
[package-manager] drizzle-kit migrate
```

**Why this works:** Ensures `DATABASE_URL` is available, preventing "url: undefined" errors.

### 5.3. If Migration Fails

See `guides/troubleshooting.md` for common issues and fixes.

Also reference `references/migrations.md` for deep dive on migration patterns.

## Phase 6: Verification

Test your setup:

### 6.1. Create Test Script

Create `test-db.ts`:
```typescript
import { db } from './src/db';
import { users } from './src/db/schema';

async function test() {
  const result = await db.select().from(users);
  console.log('Connection successful:', result);
}

test();
```

Run:
```bash
[package-manager] tsx test-db.ts
```

### 6.2. Verify Files Created

```bash
ls src/db/index.ts
ls src/db/schema.ts
ls src/db/migrations/
ls drizzle.config.ts
ls .env.local
```

## Phase 7: Next Steps

After successful setup:

1. **For Vercel projects:** Create API routes (Next.js App Router or Pages Router)
2. **For Express:** Add route handlers using `db` import
3. **Add queries:** Reference `references/query-patterns.md` for examples

## Common Issues

If you encounter problems during setup, see:
- `guides/troubleshooting.md` - Common errors and fixes
- `references/migrations.md` - Migration-specific issues
- `references/adapters.md` - Connection configuration issues
