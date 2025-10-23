<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://neon.com/brand/neon-logo-dark-color.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://neon.com/brand/neon-logo-light-color.svg">
  <img width="250px" alt="Neon Logo fallback" src="https://neon.com/brand/neon-logo-dark-color.svg">
</picture>

# Neon rules for development with AI-powered systems

This repository contains a comprehensive Neon plugin for Claude Code with context rules (`.mdc` files), skills for guided workflows, and an MCP server for resource management.

## Quick Start

### Installation in Claude Code

1. **Add the Neon marketplace**:
   ```
   /plugin marketplace add neondatabase-labs/ai-rules/neon-marketplace
   ```

2. **Install the Neon plugin**:
   ```
   /plugin install neon-plugin@neon
   ```

3. **Verify installation**:
   ```
   /help
   ```
   You should see the Neon skills available.

4. **Start using skills**:
   - `/neon-drizzle` - Set up Drizzle ORM
   - `/neon-serverless` - Configure serverless connections
   - `/neon-toolkit` - Create ephemeral databases
   - `/add-neon-docs` - Add documentation references

### What's Included

- **4 Guided Skills** with templates, scripts, and comprehensive guides
- **MCP Server Integration** for direct resource management (projects, branches, databases)

## Features

**MCP Server Integration**
- Automatically enabled when you activate the plugin
- Provides tools to manage Neon resources: projects, branches, endpoints, roles, and more
- Execute SQL queries and run migrations directly from Claude
- Analyze query performance and optimize database operations

**Context Rules & Skills**
- Context rules (`.mdc` files) provide reference documentation and best practices
- Skills offer guided workflows for common Neon tasks with templates and scripts
- Together they provide both knowledge and hands-on guidance for your development process

## Rules overview

### Core Integration Rules

- **Neon Auth (`neon-auth.mdc`)**
  Rules for implementing authentication in your application using both Stack Auth (frontend authentication system) and Neon Auth (database integration for user data).

- **Neon Serverless (`neon-serverless.mdc`)**
  Rules for connecting to and using Neon databases in serverless environments with approaches to connection pooling, environment configuration, and query optimization.

- **Neon with Drizzle (`neon-drizzle.mdc`)**
  Rules for integrating Neon databases with the Drizzle ORM framework, including setup, schema definition, and query patterns.

- **Neon Toolkit (`neon-toolkit.mdc`)**
  Guidelines for using the `@neondatabase/toolkit` to create, manage, and query ephemeral Neon Postgres databases for prototyping and testing.

### SDK Rules

- **TypeScript SDK (`neon-typescript-sdk.mdc`)**
  Rules for using the Neon TypeScript SDK for programmatic database management and operations.

- **Python SDK (`neon-python-sdk.mdc`)**
  Rules for using the Neon Python SDK for server-side database operations and integrations.

### Neon API Rules

- **API Guidelines (`neon-api-guidelines.mdc`)**
  General guidelines for using the Neon platform REST API effectively and securely.

- **API Projects (`neon-api-projects.mdc`)**
  Rules for managing Neon projects through the API.

- **API Branches (`neon-api-branches.mdc`)**
  Rules for managing database branches via the API.

- **API Endpoints (`neon-api-endpoints.mdc`)**
  Rules for managing compute endpoints through the API.

- **API Roles (`neon-api-organizations.mdc`)**
  Rules for managing roles and organizations via the API.

- **API Keys (`neon-api-keys.mdc`)**
  Rules for managing API keys and authentication.

- **API Operations (`neon-api-operations.mdc`)**
  Guidelines for executing and monitoring operations through the API.

## Claude Code Plugin & Skills

This repository includes a complete Claude Code plugin with guided skills for common Neon development tasks.

**Installation**: See [Quick Start](#quick-start) section above.

### Available Skills

- **Neon Drizzle Skill**: Set up Drizzle ORM with Neon, with comprehensive guides for different workflows (new projects, existing projects, schema-only). Includes schema generation, migration utilities, and technical references for adapters, migrations, and query patterns.
- **Neon Serverless Skill**: Configure and validate Neon connections in serverless environments with HTTP and WebSocket pooling templates.
- **Neon Toolkit Skill**: Create and manage ephemeral Neon databases for testing and CI/CD workflows.
- **Add Neon Docs Skill**: Install Neon documentation references in your project's AI configuration files (CLAUDE.md, AGENTS.md, or Cursor rules) for quick access to best practices.

Each skill includes:
- **SKILL.md**: Workflow description and instructions
- **scripts/**: Automation utilities and setup scripts
- **templates/**: Code templates and examples
- **guides/**: Step-by-step workflow guides for different scenarios (Drizzle skill only)
- **references/**: Technical reference documentation (Drizzle skill only)

The plugin also includes an MCP server configuration (`neon-plugin/.mcp.json`) that connects to Neon's remote MCP service for direct resource management.

## Using these rules in Cursor

If you use the [Cursor](https://www.cursor.so/) editor or any AI-based code assistant that supports custom rules:

1. **Open Cursor**
2. Create or navigate to the `.cursor/rules` folder in your project
3. Copy any of the `.mdc` files (e.g. `neon-auth.mdc`, `neon-serverless.mdc`, `neon-drizzle.mdc`) into `.cursor/rules`
4. *(Optional)* Re-index your project in Cursor so it automatically picks up the new rules

Example of file structure:

```
.cursor/
  rules/
    neon-auth.mdc
    neon-serverless.mdc
    neon-drizzle.mdc
```

### Usage

When using the Cursor agent, it should automatically apply these rules when generating code related to Neon.

If it doesn't, you can manually append these rules to the agent's context by referencing the specific rule file directly in your prompt.

## FAQ

### What Are `.mdc` Files?
`.mdc` stands for Markdown Context files that provide guidance to AI tools. By splitting these guidelines into separate files, AI agents can automatically pull the relevant best practices when they see code related to Neon, Stack Auth, or Drizzle.

### Can I use these rules elsewhere?
Yes! You can integrate `.mdc` files in any AI environment that supports custom context rules. The format is language-agnostic and designed to guide AI-assisted code generation.

### How do I add or update rules?
Simply create a new `.mdc` file or edit an existing one. Your AI tool will use the content to guide its responses when you're working with the relevant technologies.

## Alternative Installation Methods

### For Cursor Users

Copy `.mdc` files directly to your project:

1. Create `.cursor/rules/` directory in your project
2. Copy desired `.mdc` files (e.g., `neon-drizzle.mdc`, `neon-serverless.mdc`)
3. Cursor will automatically apply these rules

### For Other AI Tools

The `.mdc` files are tool-agnostic and can be used with any AI assistant that supports custom context rules.

## Repository Structure

```
ai-rules/
├── neon-marketplace/           # Claude Code marketplace
│   ├── .claude-plugin/
│   │   └── marketplace.json    # Marketplace metadata
│   └── neon-plugin/            # Main plugin
│       ├── .claude-plugin/
│       │   └── plugin.json     # Plugin metadata
│       ├── .mcp.json           # MCP server config
│       └── skills/             # Guided skills
├── *.mdc                       # Context rules (13 files)
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- **Documentation**: https://neon.tech/docs/guides/claude-code
- **Issues**: https://github.com/neondatabase-labs/ai-rules/issues
- **Discord**: https://discord.gg/neon

## License

MIT License - see [LICENSE](LICENSE) file for details.
