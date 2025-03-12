# Neon Rules for development with AI powered systems

This repository contains AI rules that can be used to enhance the development experience within any AI agent when working on projects that use Neon.

## Rules

- [Neon Auth](neon-auth.mdc)
- [Neon Serverless](neon-serverless.mdc)
- [Neon with Drizzle](neon-drizzle.mdc)

## Cursor

### Installation

1. Open Cursor
2. In the `.cursor/rules` add the rules you want to use
3. (optional) Reindex the codebase

Example of file structure:

```
.cursor/
  rules/
    neon-auth.mdc
    neon-serverless.mdc
```

### Usage

When using Cursor agent, it should automatically use the rules you have added when generating code related to Neon.

If it doesn't, you can always append these rules to the context of the agent by referring any of the rule files directly in the prompt.
