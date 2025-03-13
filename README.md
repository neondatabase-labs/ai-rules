<img width="250px" src="https://neon.tech/brand/neon-logo-dark-color.svg" />

# Neon rules for development with AI-powered systems

This repository contains context rules (`.mdc` files) that guide AI systems in understanding, generating, and validating code when you're working with Neon technologies.

## Rules overview

- **Neon Auth (`neon-auth.mdc`)**  
  Guidelines for implementing authentication in your application using both Stack Auth (frontend authentication system) and Neon Auth (database integration for user data).

- **Neon Serverless (`neon-serverless.mdc`)**  
  Guidelines for connecting to and using Neon databases in serverless environments with approaches to connection pooling, environment configuration, and query optimization.

- **Neon with Drizzle (`neon-drizzle.mdc`)**  
  Guidelines for integrating Neon databases with the Drizzle ORM framework, including setup, schema definition, and query patterns.

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
