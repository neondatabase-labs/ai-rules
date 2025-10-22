---
name: neon-toolkit
description: Create and manage ephemeral Neon databases for testing and prototyping. Use this skill when building temporary databases for CI/CD, running tests, or quick development workflows that need isolated database environments.
allowed-tools: ["bash"]
---

# Neon Toolkit Skill

This skill guides you through the **Neon Toolkit** (`@neondatabase/toolkit`), a comprehensive tool for creating, managing, and destroying temporary Neon databases programmatically.

## When NOT to Use This Skill

- **Production databases**: Toolkit creates ephemeral/temporary databases only
- **Shared team databases**: Use Neon Console or API for persistent environments
- **Local development**: Consider Docker PostgreSQL for local work
- **Database backups**: This tool is for creation, not backup/restore
- **Free tier accounts**: Ephemeral databases require paid projects

## Overview

The Neon Toolkit is perfect for:
- **Testing**: Create fresh database for each test run
- **CI/CD**: Spin up databases during pipeline execution
- **Prototyping**: Quick ephemeral databases without manual setup
- **Development**: Isolated environments for feature development

## Reference Documentation

For comprehensive guidelines and best practices, see **`neon-toolkit.mdc`** in the project root. It contains:
- Core concepts (Organization, Project, Branch, Endpoint, etc.)
- Installation instructions
- Authentication setup
- Database lifecycle management
- API client usage
- Error handling

## Installation

Install the Neon Toolkit:

```bash
npm install @neondatabase/toolkit
```

For Deno/Bun:

```bash
deno add jsr:@neon/toolkit
bunx jsr add @neon/toolkit
```

## Setup

### 1. Get API Key

Create a Neon API key from the [Neon Console](https://console.neon.tech/app/settings/api-keys).

### 2. Set Environment Variable

```bash
export NEON_API_KEY=your_api_key_here
```

### 3. Basic Usage

```typescript
import { NeonToolkit } from '@neondatabase/toolkit';

const neon = new NeonToolkit({
  apiKey: process.env.NEON_API_KEY!,
});

// Create an ephemeral database
const db = await neon.createEphemeralDatabase();
console.log(`Database URL: ${db.url}`);

// Use the database...

// Cleanup
await db.delete();
```

## Common Tasks

### 1. Create Ephemeral Database

```typescript
const db = await neon.createEphemeralDatabase({
  projectId: 'your-project-id', // optional
});
```

### 2. Run Queries

```typescript
const result = await db.query('SELECT 1 as result');
console.log(result.rows); // [{ result: 1 }]
```

### 3. Manage Database Lifecycle

```typescript
// Create
const db = await neon.createEphemeralDatabase();

// Query
await db.query('CREATE TABLE users (id SERIAL, name TEXT)');
await db.query('INSERT INTO users (name) VALUES ($1)', ['John']);

// Cleanup
await db.delete();
```

## Templates

See the `templates/` directory for:
- **toolkit-workflow.ts** - Complete ephemeral database workflow

## Scripts

See the `scripts/` directory for:
- **create-ephemeral-db.ts** - Create a temporary database
- **destroy-ephemeral-db.ts** - Clean up ephemeral database

## Key Concepts

**Organization**: Top-level container for billing and users
**Project**: Contains database resources for your application
**Branch**: Lightweight copy of database state (like git branches)
**Compute Endpoint**: Running PostgreSQL instance
**Database**: Logical container for tables (standard PostgreSQL)
**Role**: PostgreSQL user for authentication

## Use Cases

### Testing
```typescript
const db = await neon.createEphemeralDatabase();
// Run tests with fresh database
await db.delete();
```

### CI/CD Integration
```bash
#!/bin/bash
export NEON_API_KEY=${{ secrets.NEON_API_KEY }}
npm test # Uses ephemeral database
```

### Development Workflow
```typescript
// Create database for specific feature branch
const db = await neon.createEphemeralDatabase();
// Work with isolated environment
await db.delete(); // Cleanup when done
```

## Error Handling

### Common Errors and Solutions

**"Invalid API key"**
```typescript
// ❌ Wrong: API key not set
const neon = new NeonToolkit({ apiKey: process.env.NEON_API_KEY! });

// ✅ Correct: Validate before use
if (!process.env.NEON_API_KEY) {
  throw new Error('NEON_API_KEY environment variable is required');
}
const neon = new NeonToolkit({ apiKey: process.env.NEON_API_KEY });
```

**"Cannot create ephemeral database - quota exceeded"**
```typescript
// Ensure you have an active paid project
// Free tier has limits on ephemeral database creation
// Solution: Upgrade project to paid plan or check quota
```

**"Database not deleted properly (cleanup failed)"**
```typescript
// ✅ Correct: Always wrap in try/finally
async function testWithDatabase() {
  let db;
  try {
    db = await neon.createEphemeralDatabase();
    // Run tests
  } finally {
    if (db) await db.delete().catch(err => console.error('Cleanup failed:', err));
  }
}
```

**"Connection timeout after creation"**
```typescript
// Database may still be spinning up, add retry logic
async function queryWithRetry(db: any, sql: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.query(sql);
    } catch (error) {
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
}
```

## Related Skills

- **neon-serverless** - For connecting to databases
- **neon-drizzle** - For schema and migrations
- **neon-api** - For detailed resource management
