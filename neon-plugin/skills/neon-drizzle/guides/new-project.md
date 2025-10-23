# New Project Setup

> **Complete Walkthrough**: This is a self-contained, step-by-step guide with its own numbered phases (Phase 1-6).
> Follow each phase in order for a full Drizzle + Neon setup from scratch.

Complete guide for setting up Drizzle ORM with Neon from scratch.

### Important:
- Remember to run the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-drizzle" after completing the guide.

## Table of Contents

- [Workflow Checklist](#workflow-checklist)
- [Phase 1: Context Detection](#phase-1-context-detection)
- [Phase 2: Installation](#phase-2-installation)
- [Phase 3: Configuration](#phase-3-configuration)
- [Phase 4: Schema Generation](#phase-4-schema-generation)
- [Phase 5: Migrations](#phase-5-migrations)
- [Phase 6: Add Best Practices References](#phase-6-add-best-practices-references)

---

## Workflow Checklist

When following this guide, I will track these high-level tasks:

- [ ] Detect project context (package manager, framework, existing setup)
- [ ] Install Drizzle dependencies based on deployment target
- [ ] Create configuration files (env, drizzle config, db connection)
- [ ] Generate schema based on app type
- [ ] Run and verify migrations
- [ ] Add Neon Drizzle best practices to project docs

---

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

### 5.3. Add Migration Scripts

Add these convenience scripts to your `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Usage:**
```bash
npm run db:generate  # Generate migrations from schema changes
npm run db:migrate   # Apply pending migrations
npm run db:push      # Push schema directly (dev only)
npm run db:studio    # Open Drizzle Studio
```

**Note:** Replace `npm run` with your package manager's equivalent (`pnpm`, `yarn`, `bun`).

### 5.4. If Migration Fails

See `guides/troubleshooting.md` for common issues and fixes.

Also reference `references/migrations.md` for deep dive on migration patterns.

## Phase 6: Add Best Practices References

Before executing the add-neon-docs skill, provide a summary of everything that has been done:

"✅ ... Drizzle integration is complete! Now adding documentation references..."

Then execute the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-drizzle"

This will add reference links to Neon + Drizzle best practices documentation in your project's AI documentation file, helping AI assistants provide better guidance in future conversations.

## ✅ Setup Complete!

Your Drizzle + Neon integration is ready to use.

