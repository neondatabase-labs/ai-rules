# Neon Claude Code Plugin

Complete integration plugin for using Neon Postgres databases with Claude Code, featuring guided skills and MCP server integration.

## Features

- **Guided Skills**: Step-by-step workflows for common Neon tasks
- **MCP Integration**: Real-time Neon resource management through Model Context Protocol
- **Knowledge Installation**: Add Neon best practices to your project's AI knowledge base

## Available Skills

### neon-drizzle
Set up and integrate Drizzle ORM with Neon Postgres databases. Includes comprehensive guides for:
- New project setup
- Existing project integration
- Schema-only workflows
- Migration troubleshooting

### neon-serverless
Connect to Neon databases in serverless environments with the Neon Serverless driver. Optimize for:
- Edge functions
- Vercel deployments
- AWS Lambda
- Low latency and connection pooling

### neon-toolkit
Create and manage ephemeral Neon databases for testing and prototyping. Perfect for:
- CI/CD pipelines
- Test isolation
- Quick development workflows

## Knowledge Installation

After completing a skill workflow, you can optionally install Neon best practices to your project's AI knowledge base.

### How It Works

1. Complete any Neon skill workflow (Drizzle, Serverless, Toolkit, etc.)
2. I'll detect your project's AI structure:
   - **Cursor IDE**: `.cursor/rules/`
   - **Claude Code**: `CLAUDE.md` or `.claude/`
   - **Custom**: `agents.md`, `.ai/`, or other locations
3. I'll ask if you want to install documentation
4. I'll copy the relevant `.mdc` files with source attribution
5. Your AI assistant can now reference these patterns automatically

### What Gets Installed

Each skill installs its relevant best practices:

- **neon-drizzle**: Drizzle ORM integration, connection adapters, schema patterns
- **neon-serverless**: Serverless connections, pooling, edge runtime considerations
- **neon-toolkit**: Ephemeral database creation, testing workflows

### No AI Structure Yet?

If your project doesn't have an AI knowledge structure yet:
- I can create a `CLAUDE.md` file for you
- Or you can run `/init` in Claude Code first
- Or set up Cursor rules manually

### For Developers

Skills use a workflow-based approach. See `shared/workflows/install-knowledge.md` for the universal workflow that guides me through the installation process.

## Getting Started

1. Install the plugin in Claude Code
2. Activate a skill based on your needs
3. Follow the guided workflow
4. Optionally install knowledge to your project

## MCP Server Integration

This plugin connects to Neon's remote MCP server for real-time resource management. The MCP server provides:
- Project listing and creation
- Branch management
- Database operations
- Connection string generation

Configuration is handled automatically through `.mcp.json`.

## Repository Structure

```
dev-marketplace/neon-plugin/
├── .claude-plugin/
│   └── plugin.json        # Plugin metadata
├── .mcp.json              # MCP server configuration
└── skills/
    ├── add-neon-knowledge/
    │   ├── SKILL.md
    │   ├── install-knowledge.md        # Workflow for knowledge installation
    │   └── skill-knowledge-map.json    # Metadata for knowledge installation
    ├── neon-drizzle/
    │   ├── SKILL.md
    │   ├── guides/        # Step-by-step workflow guides
    │   ├── references/    # Technical reference docs
    │   ├── scripts/       # Utility scripts
    │   └── templates/     # Code templates
    ├── neon-serverless/
    │   └── SKILL.md
    └── neon-toolkit/
        └── SKILL.md
```

## Contributing

To add a new skill or update existing ones:
1. Follow the skill structure pattern
2. Update `skills/add-neon-knowledge/skill-knowledge-map.json` if adding knowledge files
3. Reference the `add-neon-knowledge` skill at the end of your SKILL.md
4. Test the workflow thoroughly

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [MCP Protocol](https://modelcontextprotocol.io)

## License

See the main repository for license information.
