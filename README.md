<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://neon.com/brand/neon-logo-dark-color.svg?new">
  <source media="(prefers-color-scheme: light)" srcset="https://neon.com/brand/neon-logo-light-color.svg?new">
  <img width="250px" alt="Neon Logo fallback" src="https://neon.com/brand/neon-logo-dark-color.svg?new">
</picture>

> [!IMPORTANT]
> **This repository has been archived.** The content has moved to [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills).
>
> [Agent Skills](https://neon.com/blog/agent-skills-in-2026) are now a specification supported by all major agents and coding editors, providing more capabilities than rule files. We created a new repository following the agent-skills pattern introduced by Vercel.
>
> ```bash
> npx skills add neondatabase/agent-skills
> ```

# Neon AI Development Toolkit

A comprehensive Claude Code plugin with AI context rules, guided skills, and resource management tools for building with Neon Postgres. Works with Claude Code, Cursor, and other AI-powered development tools.

## What's Inside

### For Claude Code Users
- **Claude Code Plugin** - The plugin itself, which includes 6 skills and MCP server integration
- **Claude Code Skills** - Interactive workflows with templates and automation scripts for Neon
- **MCP Server Integration** - Direct Neon resource management (projects, branches, databases)

### For Cursor & Other AI Tools
- **Portable .mdc Files** - Standalone context rules that work anywhere
- **Tool-Agnostic Format** - Use with any AI assistant supporting custom rules

---

## Quick Start

### Claude Code

**1. Add the Neon marketplace:**
```bash
/plugin marketplace add neondatabase-labs/ai-rules
```

**2. Install the plugin:**
```bash
/plugin install neon-plugin@neon
```

**3. Verify installation:**
Ask Claude Code: "which skills do you have access to?"

You should see the Neon skills listed.

**4. Start using:**
Use natural language and skills activate automatically:
```bash
> Use the neon-drizzle skill to setup Drizzle ORM with Neon
```

### Cursor

**1. Create rules directory:**
```bash
mkdir -p .cursor/rules
```

**2. Copy desired `.mdc` files:**
```bash
# Example: Copy Drizzle and Serverless rules
cp neon-drizzle.mdc .cursor/rules/
cp neon-serverless.mdc .cursor/rules/
```

**3. Start coding:**
Cursor automatically applies these rules when you reference Neon.

### Other AI Tools

Copy `.mdc` files to your AI tool's custom rules directory. The format is tool-agnostic and works with any AI assistant supporting context rules.

---

## Skills Reference

<details>
<summary><strong>Neon Drizzle</strong> - Setup Drizzle ORM with Neon</summary>

Complete workflow support for:
- New project setup
- Existing project integration
- Schema-only workflows

**Includes:**
- Schema generation utilities
- Migration scripts (`db:generate`, `db:migrate`, `db:push`, `db:studio`)
- HTTP and WebSocket adapter templates
- Technical references for adapters, migrations, and query patterns

**Guides:**
- `guides/new-project.md` - Starting from scratch
- `guides/existing-project.md` - Adding to existing codebase
- `guides/schema-only.md` - Schema-first development
- `guides/troubleshooting.md` - Common issues and solutions

</details>

<details>
<summary><strong>Neon Serverless</strong> - Configure serverless database connections</summary>

Templates for:
- HTTP connections (single-query operations)
- WebSocket pooling (long-running processes)
- Connection validation utilities

</details>

<details>
<summary><strong>Neon Toolkit</strong> - Manage ephemeral databases</summary>

Perfect for testing and CI/CD:
- Create temporary databases
- Run tests in isolation
- Clean up automatically

**Includes:**
- `create-ephemeral-db.ts` - Database creation
- `destroy-ephemeral-db.ts` - Cleanup automation
- Workflow templates

</details>

<details>
<summary><strong>Neon Auth</strong> - Integrate Neon Auth authentication</summary>

Complete authentication setup with `@neondatabase/auth`:
- Next.js App Router integration
- React SPA setup
- Auth client configuration templates
- API route handlers

**Guides:**
- `guides/nextjs-setup.md` - Next.js App Router workflow
- `guides/react-spa-setup.md` - React SPA workflow

</details>

<details>
<summary><strong>Neon JS</strong> - Full Neon JS SDK integration</summary>

Unified SDK setup with `@neondatabase/neon-js`:
- Combined auth + data API client
- Type-safe database operations
- Theming and customization

**Guides:**
- `guides/setup.md` - Complete setup workflow

</details>

<details>
<summary><strong>Add Neon Docs</strong> - Install documentation references</summary>

Adds Neon best practices to your project's AI configuration:
- CLAUDE.md
- AGENTS.md
- Cursor rules files

</details>

---

## Testing & Quality Assurance

Our skills are tested with automated evaluations to ensure reliability and quality.

![Neon Drizzle Skill](https://img.shields.io/badge/neon--drizzle-95.0%25%20pass-brightgreen) ![Add Neon Docs Skill](https://img.shields.io/badge/add--neon--docs-91.7%25%20pass-green)

| Skill | Pass Rate | Test Date | Details |
|-------|-----------|-----------|---------|
| neon-drizzle | 95.0% (19/20) | Oct 29, 2025 | [View Results](neon-plugin/evals/neon-drizzle-skill/eval-results/eval-neon-drizzle-skill-2025-10-29-164501/results.md) |
| add-neon-docs | 91.7% (55/60) | Oct 28, 2025 | [View Results](neon-plugin/evals/add-neon-knowledge-skill/eval-results/eval-add-neon-docs-skills-2025-10-28-192850/results.md) |

**Evaluation Methodology**: Each skill is tested with multiple prompts across 10+ iterations using real Claude Code environments with the plugin loaded. Scorers validate build success, skill activation, and output correctness.

---

## Context Rules (.mdc Files)

<details>
<summary><strong>Getting Started</strong> - 2 files</summary>

**Neon Get Started** (`neon-get-started.mdc`)

- Interactive onboarding guide for connecting projects to Neon
- Step-by-step setup (projects, connection strings, dependencies, schema)
- Works with new or existing codebases
- Communication style guidelines for AI assistants

**Neon Get Started (Kiro)** (`neon-get-started-kiro.mdc`)

- Kiro-specific onboarding guide

</details>

<details>
<summary><strong>Core Integration Rules</strong> - 5 files</summary>

**Neon Auth** (`neon-auth.mdc`)
- Stack Auth + Neon Auth integration
- Authentication patterns for user data

**Neon JS** (`neon-js.mdc`)
- Full Neon JS SDK with `@neondatabase/neon-js`
- Combined auth + data API client

**Neon Serverless** (`neon-serverless.mdc`)
- Serverless connection patterns
- Pooling and environment configuration
- Query optimization

**Neon with Drizzle** (`neon-drizzle.mdc`)
- Drizzle ORM integration
- Schema definition patterns
- Type-safe queries

**Neon Toolkit** (`neon-toolkit.mdc`)
- Ephemeral database management
- Testing and prototyping patterns

</details>

<details>
<summary><strong>SDK Rules</strong> - 2 files</summary>

**TypeScript SDK** (`neon-typescript-sdk.mdc`)
- Programmatic database management
- TypeScript-specific patterns

**Python SDK** (`neon-python-sdk.mdc`)
- Server-side operations
- Python integration patterns

</details>

<details>
<summary><strong>Neon API Rules</strong> - 7 files</summary>

**API Guidelines** (`neon-api-guidelines.mdc`)
- REST API best practices
- Security and authentication

**API Projects** (`neon-api-projects.mdc`)
- Project management operations

**API Branches** (`neon-api-branches.mdc`)
- Branch management and workflows

**API Endpoints** (`neon-api-endpoints.mdc`)
- Compute endpoint management

**API Roles** (`neon-api-organizations.mdc`)
- Organization and role management

**API Keys** (`neon-api-keys.mdc`)
- API key management
- Authentication configuration

**API Operations** (`neon-api-operations.mdc`)
- Operation execution
- Status monitoring

</details>

---

## MCP Server Integration

Available automatically when you activate the Claude Code plugin.

**Features:**
- Manage Neon resources: projects, branches, endpoints, roles
- Execute SQL queries directly from Claude
- Run migrations
- Analyze query performance
- Optimize database operations

**Configuration:** `neon-plugin/.mcp.json` connects to Neon's remote MCP service (https://mcp.neon.tech/mcp)

---

## Repository Structure

```
ai-rules/
├── .claude-plugin/
│   └── marketplace.json        # Marketplace metadata
├── neon-plugin/                # Claude Code plugin
│   ├── .claude-plugin/
│   │   └── plugin.json         # Plugin configuration
│   ├── .mcp.json               # MCP server connection
│   └── skills/                 # Guided skills (6 total)
│       ├── add-neon-docs/      # Docs installer skill
│       ├── neon-auth/          # Neon Auth skill
│       ├── neon-drizzle/       # Drizzle ORM skill
│       │   ├── SKILL.md
│       │   ├── guides/         # Workflow guides
│       │   ├── references/     # Technical docs
│       │   ├── scripts/        # Automation
│       │   └── templates/      # Code examples
│       ├── neon-js/            # Neon JS SDK skill
│       ├── neon-serverless/    # Serverless skill
│       └── neon-toolkit/       # Ephemeral DB skill
├── *.mdc                       # Context rules (16 files)
├── LICENSE
└── README.md
```

---

## FAQ

**What are .mdc files?**
Markdown Context files that provide guidance to AI tools. They contain best practices and patterns that AI assistants automatically apply when generating code.

**Can I use specific rules without the full plugin?**
Yes! Copy individual `.mdc` files to your AI tool's rules directory. Each file is self-contained and doesn't require dependencies.

**How do I add or update rules?**
Create a new `.mdc` file or edit existing ones. AI tools will automatically use the updated content.

**Do skills work with Cursor?**
Skills are Claude Code-specific. For Cursor, use the `.mdc` context rules instead.

**Can I use these rules in ChatGPT or other AI tools?**
Yes! The `.mdc` files work with any AI assistant that supports custom context rules. Copy them to your tool's configuration directory.

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Support

- **Documentation**: https://neon.com/docs/ai/ai-rules
- **Issues**: https://github.com/neondatabase-labs/ai-rules/issues
- **Discord**: https://discord.com/channels/1176467419317940276/@home

---

## License

MIT License - see [LICENSE](LICENSE) file for details.
