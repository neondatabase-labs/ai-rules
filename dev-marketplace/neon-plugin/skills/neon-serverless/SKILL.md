---
name: neon-serverless
description: Configures Neon Serverless Driver for edge functions, Vercel deployments, AWS Lambda, and other serverless environments. Use when setting up database connections with low latency and connection pooling requirements.
allowed-tools: ["bash"]
---

# Neon Serverless Skill

Configures the Neon Serverless Driver for optimal performance in serverless and edge computing environments.

## When to Use

- Setting up connections for edge functions (Vercel Edge, Cloudflare Workers)
- Configuring serverless APIs (AWS Lambda, Google Cloud Functions)
- Optimizing for low-latency database access
- Implementing connection pooling for high-throughput apps

**Not recommended for:** Complex multi-statement transactions (use WebSocket Pool), persistent servers (use native PostgreSQL drivers), or offline-first applications.

## Reference Documentation

**Primary Resource:** See `[neon-serverless.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-serverless.mdc)` in project root for comprehensive guidelines including:
- Installation and compatibility requirements
- HTTP vs WebSocket adapter selection
- Connection pooling strategies
- Query optimization patterns
- Error handling and troubleshooting

## Quick Setup

### Installation
```bash
npm install @neondatabase/serverless
```

### Connection Patterns

**HTTP Client** (recommended for edge/serverless):
```typescript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;
```

**WebSocket Pool** (for Node.js long-lived connections):
```typescript
import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

See `templates/` for complete examples:
- `templates/http-connection.ts` - HTTP client setup
- `templates/websocket-pool.ts` - WebSocket pool configuration

## Validation

Use `scripts/validate-connection.ts` to test your database connection before deployment.

## Related Skills

- **neon-drizzle** - For ORM with serverless connections
- **neon-toolkit** - For ephemeral database testing

---

**Want best practices in your project?** Run `neon-plugin:add-neon-docs` with parameter `SKILL_NAME="neon-serverless"` to add reference links.
