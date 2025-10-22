---
name: neon-serverless
description: Connect to Neon databases in serverless environments with the Neon Serverless driver. Use this skill when setting up connections for edge functions, Vercel deployments, AWS Lambda, or optimizing for low latency and connection pooling.
allowed-tools: ["bash"]
---

# Neon Serverless Skill

This skill provides guidance for using the **Neon Serverless Driver** (`@neondatabase/serverless`) to connect to Neon databases in serverless and edge computing environments.

## When NOT to Use This Skill

- **Complex transactions**: Use WebSocket Pool for multi-statement ACID transactions
- **Persistent server apps**: Consider native PostgreSQL drivers for Node.js servers (better performance)
- **Offline-first apps**: This requires active internet connection
- **Long-running queries**: HTTP connections have timeout limits; use WebSocket for queries >30s

## Overview

The Neon Serverless driver provides two connection methods optimized for different use cases:

1. **HTTP** - Ideal for stateless, short-lived functions (Vercel Edge, Lambda, etc.)
2. **WebSocket** - Ideal for long-lived connections and interactive transactions

## Reference Documentation

For comprehensive guidelines and best practices, see **`neon-serverless.mdc`** in the project root. It contains:
- Installation instructions and compatibility requirements
- Connection string configuration
- HTTP vs WebSocket comparison
- Query optimization patterns
- Connection pooling strategies
- Error handling

## Installation

Install the Neon Serverless driver:

```bash
npm install @neondatabase/serverless
```

For JSR-based projects (Deno, Bun):

```bash
bunx jsr add @neon/serverless
```

**Requirements:** Node.js v19+ (for driver v1.0.0+)

## Connection Patterns

### HTTP Client (Recommended for Serverless)

Best for edge functions and stateless deployments:

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Single query
const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;
```

### WebSocket Pool (Node.js, Long-lived)

Best for server environments needing interactive transactions:

```typescript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
});

const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

## Environment Setup

Always use environment variables for connection strings:

```bash
DATABASE_URL="postgresql://user:password@neon.tech/dbname?sslmode=require"
```

## Common Tasks

### 1. Validate Connection String

Check your connection string before deploying:

```typescript
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
```

### 2. Handle Connection Errors

```typescript
try {
  const result = await sql`SELECT 1`;
} catch (error) {
  console.error('Connection failed:', error);
}
```

### 3. Use Connection Pooling

For multiple concurrent queries, enable pooling:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20, // Maximum connections in pool
});
```

## Error Handling

### Common Errors and Solutions

**"Connection refused"**
```typescript
// ❌ Wrong: Missing environment variable
const sql = neon(process.env.DATABASE_URL!);

// ✅ Correct: Always validate
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
const sql = neon(process.env.DATABASE_URL);
```

**"Timeout" on HTTP requests**
```typescript
// Set explicit timeouts for long operations
try {
  const result = await sql`SELECT * FROM large_table LIMIT 1000`;
} catch (error) {
  if (error instanceof Error && error.message.includes('timeout')) {
    console.error('Query exceeded timeout. Use WebSocket pool for long operations.');
  }
}
```

**"Too many connections" with WebSocket**
```typescript
// Add connection pool cleanup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20,
  idleTimeoutMillis: 30000, // Close idle connections
  connectionTimeoutMillis: 2000,
});

// Cleanup on exit
process.on('exit', () => pool.end());
```

## Templates

See the `templates/` directory for:
- **http-connection.ts** - HTTP client setup
- **websocket-pool.ts** - WebSocket pool configuration

## Scripts

See the `scripts/` directory for:
- **validate-connection.ts** - Test your database connection

## Performance Tips

- Use HTTP for short-lived functions (fastest startup)
- Use WebSocket pooling for high-throughput applications
- Minimize connection setup time with connection pooling
- Reuse connections where possible

## Related Skills

- **neon-drizzle** - For ORM with serverless connections
- **neon-toolkit** - For ephemeral database testing
