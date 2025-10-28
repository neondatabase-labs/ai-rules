---
name: add-neon-docs
description: Use this skill when the user asks to add documentation, add docs, add references, or install documentation about Neon. Adds Neon best practices reference links to project AI documentation (CLAUDE.md, AGENTS.md, or Cursor rules). Does not install packages or modify code.
allowed-tools: ["read_file", "write", "bash", "AskUserQuestion"]
---

# Add Neon Knowledge References to Project

This skill adds reference links to Neon documentation and best practices in your project's AI documentation file, enabling AI assistants to quickly access Neon-specific patterns and guidelines without cluttering your project with large documentation files.

## How It Works

This skill follows a simple workflow:

1. **Load metadata** - Read skill information from `skill-knowledge-map.json`
2. **Detect documentation file** - Find `CLAUDE.md`, `AGENTS.md`, or Cursor rules files
3. **Ask permission** - Show what will be added and where
4. **Add references** - Insert URLs in a "Resources & References" section
5. **Report completion** - Confirm successful installation

For detailed workflow steps, see `install-knowledge.md`.

## Parameters

### SKILL_NAME Parameter

Optional. Specifies which skill documentation to install (e.g., `"neon-drizzle"`). If not provided, you'll be prompted to choose from available skills defined in `skill-knowledge-map.json`.

## Usage Examples

**Called from another skill:**
```markdown
Execute the add-neon-docs skill with SKILL_NAME="neon-drizzle"
```

**Called directly by user:**
- "Add neon drizzle knowledge to my project"
- "Install neon serverless documentation"
- "Set up Neon best practices for my AI assistant"

## What Gets Added

References are added to a "Resources & References" section in your AI documentation file:

```markdown
## Resources & References

- **Neon and Drizzle ORM best practices**: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-drizzle.mdc
- **Serverless connection patterns**: https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-serverless.mdc
```

### Target Files (in priority order):
- `CLAUDE.md` - Most common for Claude Code projects
- `AGENTS.md` - Custom AI documentation files
- `.cursor/README.md` or `.cursor/rules.md` - Cursor IDE projects
- Creates `CLAUDE.md` if none exist

### Behavior:
- Existing "Resources & References" sections: New links are appended
- No existing section: Section is created at end of file
- No documentation file: `CLAUDE.md` is created with references

## Related Skills

- **neon-drizzle** - Sets up Drizzle ORM, then offers this skill
- **neon-serverless** - Sets up connections, then offers this skill
- **neon-toolkit** - Sets up ephemeral databases, then offers this skill

## Workflow Reference

For complete implementation details:
- **Workflow**: `install-knowledge.md` - Step-by-step agent workflow with error handling
- **Metadata**: `skill-knowledge-map.json` - Skill definitions and reference URLs

---

## Workflow Implementation

Now I'll execute the installation workflow for you.

**Parameter received**: SKILL_NAME = ${SKILL_NAME || "not provided - will ask user"}

Execute `install-knowledge.md` with the specified SKILL_NAME.
