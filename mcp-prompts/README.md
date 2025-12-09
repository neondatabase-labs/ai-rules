# MCP Prompt Templates

Lightweight prompt templates for the Neon MCP server that link to comprehensive guides in this repository.

## Purpose

These templates provide structure and navigation for MCP prompts while keeping the actual content in the ai-rules repository. This ensures:
- **Single source of truth** for all documentation
- **Easy maintenance** - update docs in one place
- **Automatic updates** - MCP prompts use latest version from main branch via GitHub raw URLs
- **No duplication** - content lives in guides, references, and .mdc files

## Template Architecture

Each template follows the **progressive disclosure** pattern from Claude Code skills best practices:

1. **Communication Style** - How the AI should interact with users
2. **Context Detection** - Auto-detect framework, package manager, existing setup
3. **Package Selection** - Guide user to right package for their needs
4. **Framework Routing** - Link to appropriate detailed guide based on context
5. **Key Configuration** - Highlight critical paths and common mistakes
6. **Validation Steps** - Guide user through testing
7. **Troubleshooting Links** - Load error resources only when needed
8. **Comprehensive Reference** - Link to full .mdc file for deep dives

## Available Templates

### neon-auth-setup.md
**Purpose**: Interactive authentication setup guide

**Covers**:
- Package selection (auth-only vs full SDK)
- Framework detection (Next.js, React SPA, Node.js)
- Links to detailed Next.js guide
- React SPA and Node.js adaptations
- Critical import paths and CSS strategy
- Validation and troubleshooting

**Links to**:
- `/neon-plugin/skills/neon-auth/guides/setup.md` (complete setup guide for all frameworks)
- `/references/neon-auth-setup.md` (canonical setup reference)
- `/neon-auth.mdc` (comprehensive reference)
- `/references/neon-auth-common-mistakes.md`
- `/references/neon-auth-troubleshooting.md`

### neon-js-setup.md
**Purpose**: Interactive full SDK setup (auth + database queries)

**Covers**:
- Package confirmation (full SDK vs auth-only)
- Framework detection
- Links to detailed setup guide
- React SPA and Node.js adaptations
- Database query patterns (PostgREST syntax)
- Type generation workflow
- Validation for both auth and database

**Links to**:
- `/neon-plugin/skills/neon-js/guides/setup.md` (complete setup guide)
- `/references/neon-auth-setup.md` (auth setup reference)
- `/references/neon-js-data-api.md` (database query patterns)
- `/neon-js.mdc` (comprehensive reference)
- `/references/neon-auth-common-mistakes.md`
- `/references/neon-js-imports.md`

## Usage in MCP Server

These templates are designed to be loaded by the MCP server's `getPromptTemplate()` function.

### Option 1: Inline with Links (Recommended)

Keep templates inline in `prompts.ts` but minimal, primarily linking to GitHub:

```typescript
export const getPromptTemplate = (
  promptName: string,
  args?: Record<string, string>,
): string => {
  if (promptName === 'setup-neon-auth') {
    const projectId = args?.projectId;
    
    return `# Neon Auth Setup Guide

## Core Guide
Load the interactive template:
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/mcp-prompts/neon-auth-setup.md

## Context
${projectId ? `Project ID: ${projectId}` : 'Detect project from user context'}

## Interactive Flow
1. Load and follow the template above
2. Detect framework and existing setup
3. Route to appropriate detailed guide
4. Complete phases sequentially
5. Validate and test setup

## References
- Main: https://raw.githubusercontent.com/.../neon-auth.mdc
- Troubleshooting: https://raw.githubusercontent.com/.../neon-auth-troubleshooting.md
`;
  }
};
```

### Option 2: Runtime Fetch (Advanced)

Fetch templates from GitHub at runtime:

```typescript
async function fetchTemplate(templateName: string): Promise<string> {
  const baseUrl = 'https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/mcp-prompts';
  const response = await fetch(`${baseUrl}/${templateName}.md`);
  return response.text();
}

export const getPromptTemplate = async (
  promptName: string,
  args?: Record<string, string>,
): Promise<string> => {
  if (promptName === 'setup-neon-auth') {
    const template = await fetchTemplate('neon-auth-setup');
    // Inject context args into template
    return template.replace('{{projectId}}', args?.projectId || 'auto-detect');
  }
};
```

**Recommendation**: Use Option 1 for simplicity and reliability (no external HTTP dependencies).

## Template Structure

All templates follow this structure:

```markdown
# [Package] Setup (MCP Prompt Template)

> Purpose statement

## Communication Style
[Interaction guidelines for AI]

## Step 1: Detect Project Context
[Auto-detection commands]

## Step 2: Package/Framework Selection
[Decision logic and routing]

## Step 3: Load Framework-Specific Guide
[Links to detailed guides]

## Step 4-N: Key Configuration Points
[Critical paths, common mistakes]

## Troubleshooting Resources
[Links to error guides]

## Comprehensive Reference
[Link to main .mdc file]

## Success Criteria
[Checklist for completion]
```

## GitHub Raw URL Format

All links use this format:
```
https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/[path-to-file]
```

This ensures:
- ✅ Always loads latest version from main branch
- ✅ Fast delivery via GitHub's CDN
- ✅ Works from any AI assistant
- ✅ No authentication required for public repos

## Benefits of This Approach

### For Users
- Consistent experience across Claude Code, MCP, and other tools
- Always get latest documentation
- Clear, step-by-step guidance

### For Maintainers
- Update docs in ONE place (ai-rules repo)
- MCP prompts automatically use new version
- Easy to test (just update guide and test MCP prompt)
- Version control for all content

### For AI Assistants
- Progressive disclosure (load details only when needed)
- Clear navigation structure
- Comprehensive reference available when needed
- Troubleshooting resources on-demand

## Testing Templates

To test a template:

1. **Update content** in ai-rules repo (guide, reference, or template)
2. **Commit and push** to main branch
3. **Run MCP prompt** - it loads latest version automatically
4. **Verify** AI follows the template and loads linked guides

## Versioning

Templates include version information in footer:
```markdown
---
**Template Version**: 1.0.0
**Last Updated**: 2025-12-09
**Source Repository**: https://github.com/neondatabase-labs/ai-rules
```

Update version when making breaking changes to template structure.

## Contributing

When creating or updating templates:

1. **Keep them lightweight** - Focus on navigation and linking, not duplicating content
2. **Link, don't duplicate** - Reference existing guides
3. **Follow structure** - Use standard sections
4. **Test thoroughly** - Verify all links work
5. **Update version** - Increment on breaking changes

## Related Documentation

- [Implementation Plan](../plans/mcp-prompts-github-integration.md)
- [Claude Code Skills Best Practices](https://code.claude.com/docs/en/skills)
- [Neon Auth Guide](../neon-auth.mdc)
- [Neon JS Guide](../neon-js.mdc)
