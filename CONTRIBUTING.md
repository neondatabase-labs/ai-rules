# Contributing to Neon Claude Code Plugin

Thank you for your interest in contributing to the Neon Claude Code Plugin!

## How to Contribute

### Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Provide clear reproduction steps for bugs
- Include relevant environment information (Claude Code version, OS)

### Contributing Skills

To add a new skill:

1. **Create skill directory**: `neon-marketplace/neon-plugin/skills/your-skill-name/`
2. **Add SKILL.md**: Follow the front matter format (see existing skills)
3. **Include components**:
   - `templates/` - Code examples and templates
   - `scripts/` - Utility scripts
   - `guides/` (optional) - Step-by-step workflows
   - `references/` (optional) - Technical documentation
4. **Test thoroughly**: Verify skill loads and executes correctly in Claude Code
5. **Update documentation**: Add skill to main README

### Contributing Context Rules

To add or update `.mdc` files:

1. **Follow existing format**: Overview → Use Cases → Examples → Best Practices
2. **Keep files focused**: One technology/pattern per file
3. **Include practical examples**: Real-world code snippets
4. **Test with AI tools**: Verify rules work with Claude Code and Cursor
5. **Tool-agnostic**: Don't reference specific AI tools in the content

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test locally (see Testing section)
5. Commit with clear messages: `git commit -m "Add: new skill for XYZ"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request with:
   - Clear description of changes
   - Link to related issues
   - Testing steps performed

### Testing

Before submitting a PR:

1. **JSON validation**:
   ```bash
   jq . neon-marketplace/.claude-plugin/marketplace.json
   jq . neon-marketplace/neon-plugin/.claude-plugin/plugin.json
   ```

2. **Local testing**:
   - Test marketplace installation locally
   - Verify all skills load correctly
   - Test MCP server connection
   - Run through skill workflows

3. **Documentation**:
   - Check markdown rendering
   - Verify all links work
   - Ensure code examples are correct

### Code Style

- **Markdown**: Use consistent formatting (fenced code blocks, proper headings)
- **JSON**: 2-space indentation, sorted keys where logical
- **TypeScript/JavaScript**: Follow existing code style in templates and scripts
- **File naming**: kebab-case for files and directories

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/neondatabase-labs/ai-rules.git
   cd ai-rules
   ```

2. Test locally in Claude Code:
   ```
   /plugin marketplace add /absolute/path/to/ai-rules/neon-marketplace
   /plugin install neon-plugin@neon
   ```

3. Make changes and reload:
   ```
   /plugin reload neon-plugin
   ```

## Questions?

- Open a GitHub Issue for technical questions
- Join our Discord for community discussion (link in README)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
