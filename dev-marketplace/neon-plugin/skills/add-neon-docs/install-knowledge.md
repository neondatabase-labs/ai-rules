# Install Neon Knowledge to Project - Agent Workflow

**When to use**: When the user wants to add Neon's best practices reference links to their project's AI documentation.

**Required parameter**: `SKILL_NAME` (e.g., "neon-drizzle", "neon-serverless", "neon-toolkit", "neon-auth")

---

## Step 1: Load Skill Metadata

Read the skill metadata file to get the reference URLs.

The metadata file is bundled with this skill at:
```
skill-knowledge-map.json
```

Use the Read tool to read the local file, then parse the JSON content.

Extract the metadata for the current `SKILL_NAME` from the JSON.

Store this information - you'll need:
- `displayName`: Human-readable skill name
- `files`: Array of .mdc files (each with `url`, `filename`, `description`)

If the skill is not found in metadata, inform the user and exit.

---

## Step 2: Detect AI Documentation File

Use your existing tools to detect where to add the reference links. **This is a read-only check - no files are created yet.**

Check in this priority order:

### 2.1 Check for CLAUDE.md (most common)
```bash
[ -f CLAUDE.md ] && echo "CLAUDE_MD_FOUND" || echo "NOT_FOUND"
```

**If found**: Target is `CLAUDE.md` file

### 2.2 Check for AGENTS.md (custom AI docs)
```bash
[ -f AGENTS.md ] && echo "AGENTS_MD_FOUND" || echo "NOT_FOUND"
```

**If found**: Target is `AGENTS.md` file

### 2.3 Check for Cursor rules file
```bash
[ -f .cursor/README.md ] && echo "CURSOR_README_FOUND" || echo "NOT_FOUND"
[ -f .cursor/rules.md ] && echo "CURSOR_RULES_FOUND" || echo "NOT_FOUND"
```

**If found**: Target is `.cursor/README.md` or `.cursor/rules.md`

### 2.4 No file found
If none of the above exist, set target as: "Will create `CLAUDE.md`"

**Store the detection result** for use in Step 3.

---

## Step 3: Present Plan and STOP for User Confirmation

**STOP HERE.** Do not proceed to Step 4 until the user explicitly confirms.

Now that you know WHAT to add (from Step 1) and WHERE to add it (from Step 2), present this plan to the user in natural language:

---

I've prepared to add **${displayName}** best practices references to your project.

**Target location:** ${detected_location or "Will create CLAUDE.md"}

**References to add:**
${list each file with a bullet point showing the description and URL}

This helps your AI assistant reference Neon best practices automatically in future conversations without cluttering your project with large documentation files.

Would you like me to proceed with adding these references?

---

**Wait for explicit user confirmation** (e.g., "yes", "go ahead", "proceed") before continuing to Step 4.

If the user declines or asks to skip, thank them and exit the workflow gracefully.

---

## Step 4: Add Reference Links

### 4.1 Build the reference content

For each file in the metadata, create a reference line:

```markdown
- **${description}**: ${url}
```

Combine all references into a section:

```markdown
## Resources & References

- **${file1.description}**: ${file1.url}
- **${file2.description}**: ${file2.url}
```

### 4.2 Check if "Resources & References" section exists

Read the target file and check if it already has a "## Resources & References" section.

**If section exists:**
- Use the Edit tool to append new references to that section
- Add the new links after existing content in that section
- Ensure proper spacing (blank line between entries)

**If section doesn't exist:**
- Append the entire section to the end of the file
- Add two blank lines before the section for proper spacing

**If target file doesn't exist yet:**
- Use the Write tool to create a new file with:
  ```markdown
  # Project AI Documentation

  ## Resources & References

  - **${file.description}**: ${file.url}
  ```

### 4.3 Perform the edit/write

Execute the appropriate tool operation based on the above conditions.

### 4.4 Confirm installation

Log: `✓ Added ${displayName} reference links to ${target_location}`

---

## Step 5: Report Completion

Build a completion message:

```markdown
✅ Reference links added successfully!

Location: ${target_location}

References added:
${list each reference with title and URL}

---

Your AI assistant can now reference these Neon best practices in future conversations by following the URLs. The documentation includes:
- Connection patterns and configuration
- Best practices and gotchas
- Code examples and templates
- Common patterns and solutions

${if target is CLAUDE.md:}
Note: I'll automatically reference these resources when you ask about ${SKILL_NAME} topics.
${end if}

${if target is Cursor:}
Note: Cursor can access these resources when working on related code.
${end if}
```

---

## Error Handling

### If metadata file cannot be read
- Log a clear error message
- Suggest checking internet connection
- Exit workflow

### If write permissions denied
- Inform user about permission issue
- Suggest running with appropriate permissions
- Provide manual instructions for adding links

### If target file is locked or unavailable
- Inform user of the issue
- Suggest closing editors or checking file permissions
- Provide the reference links for manual addition

---

## Testing This Workflow

As Claude, you can test this workflow by:

1. Reading the metadata file
2. Detecting the current project's documentation file
3. Simulating user responses (or asking real questions)
4. Adding references to test locations

Verify:
- [ ] Metadata loads correctly
- [ ] File detection works for multiple project types
- [ ] Permission prompt is clear
- [ ] References are added in the correct format
- [ ] Existing "Resources & References" sections are preserved
- [ ] New sections are created when needed
- [ ] Error messages are clear

---

## For Skill Developers

To use this workflow in your skill, add at the end of your guide or skill:

```markdown
## Add Best Practices References?

Setup is complete! Would you like me to add ${SKILL_NAME} best practices reference links to your project?

This helps your AI assistant (me!) remember where to find Neon patterns for future conversations.

${Execute workflow: skills/add-neon-knowledge/install-knowledge.md with SKILL_NAME="${skill-name}"}
```

Or explicitly call it:

```markdown
I'll now add reference links to help you in future conversations.

${Read and execute: skills/add-neon-knowledge/install-knowledge.md}
${Set SKILL_NAME = "neon-drizzle"}
```
