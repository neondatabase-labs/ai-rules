# Universal Skill Knowledge Installation Workflow - Implementation Plan

## Overview

Create a universal, reusable workflow that can be integrated into ANY skill (neon-drizzle, neon-serverless, neon-toolkit, etc.) to:
1. Auto-detect the user's project knowledge structure (Cursor rules, CLAUDE.md, agents.md, etc.)
2. Offer to install skill-specific best practices documentation
3. Copy the appropriate `.mdc` file(s) from this repository to their project as source of truth

This workflow should work across all Neon skills and be easily extensible to new skills.

## Current State Analysis

### What Exists Now
- 13 `.mdc` context rule files in the repository root
- 3 skills in `dev-marketplace/neon-plugin/skills/`:
  - `neon-drizzle/` - Most comprehensive with guides, references, scripts, templates
  - `neon-serverless/` - Connection configuration
  - `neon-toolkit/` - Ephemeral database creation
- Each skill has a `SKILL.md` that describes the workflow
- Skills reference their corresponding `.mdc` files (e.g., SKILL.md mentions `neon-drizzle.mdc`)
- No current mechanism to install knowledge files to user projects

### Key Constraints
- `.mdc` files in this repo are the SOURCE OF TRUTH
- Skills should fetch raw files from this repo (not copy them locally)
- Workflow must work for any skill without modification
- Must respect different project conventions (Cursor, Claude Code, custom setups)

### Key Discoveries
- Skills already have metadata in `SKILL.md` frontmatter (name, description, allowed-tools)
- `.mdc` files use frontmatter with `description`, `globs`, `alwaysApply`
- Different AI tools use different conventions:
  - Cursor: `.cursor/rules/`
  - Claude Code: `CLAUDE.md` or `.claude/` directory
  - Custom: `agents.md`, `.ai/`, etc.

## Desired End State

A universal workflow system that:

1. **Automatically detects** the user's project knowledge structure
2. **Asks once** if they want to add Neon best practices for the skill they're using
3. **Copies the appropriate files** from this repo to their project
4. **References the source** so users know where documentation came from
5. **Works for any skill** without code duplication

### Verification Criteria
- Can be integrated into any skill by adding a single function call
- Successfully detects 5+ common project structures (Cursor, Claude, custom)
- Fetches raw `.mdc` content from this repository
- Installs files to correct location based on project type
- Provides clear user feedback about what was installed and where

## What We're NOT Doing

- NOT creating a separate CLI tool (this is integrated into skills)
- NOT modifying existing `.mdc` files (they remain source of truth)
- NOT creating new file formats (using existing `.mdc` and markdown)
- NOT building a package manager (simple file copy with context)
- NOT supporting non-Neon skills (focused on this repository's skills)

## Implementation Approach

### High-Level Strategy

Create a **shared utility module** that all skills can import and call. This module:

1. **Detection Phase**: Scans the user's project for knowledge structures
2. **Mapping Phase**: Maps the current skill to its corresponding `.mdc` files
3. **Interaction Phase**: Asks user if they want to install knowledge
4. **Installation Phase**: Fetches and copies files with appropriate headers
5. **Verification Phase**: Confirms installation and provides next steps

### Architecture Decision

**Option A: Shared Script Module** (RECOMMENDED)
- Create `dev-marketplace/neon-plugin/shared/knowledge-installer.ts`
- Each skill imports and calls this at the end of their workflow
- Centralized logic, easy to maintain

**Option B: Pre/Post Skill Hooks**
- Add hooks to Claude Code skill lifecycle
- More automatic but less control

**Decision**: Go with Option A for simplicity and explicit control.

## Phase 1: Create Skill-to-MDC Mapping System

### Overview
Build a metadata system that maps each skill to its relevant `.mdc` files and provides installation context.

### Changes Required

#### 1. Create Skill Metadata Registry
**File**: `dev-marketplace/neon-plugin/shared/skill-metadata.json`
**Purpose**: Single source of truth mapping skills to their documentation

```json
{
  "neon-drizzle": {
    "skillName": "Neon Drizzle Integration",
    "mdcFiles": [
      {
        "filename": "neon-drizzle.mdc",
        "rawUrl": "https://raw.githubusercontent.com/neondatabase/ai-rules/main/neon-drizzle.mdc",
        "description": "Best practices for integrating Neon with Drizzle ORM",
        "priority": 1,
        "required": true
      },
      {
        "filename": "neon-serverless.mdc",
        "rawUrl": "https://raw.githubusercontent.com/neondatabase/ai-rules/main/neon-serverless.mdc",
        "description": "Serverless connection patterns (optional reference)",
        "priority": 2,
        "required": false
      }
    ],
    "setupComplete": "Drizzle setup is complete! Your AI assistant now has access to Neon + Drizzle best practices."
  },
  "neon-serverless": {
    "skillName": "Neon Serverless Connections",
    "mdcFiles": [
      {
        "filename": "neon-serverless.mdc",
        "rawUrl": "https://raw.githubusercontent.com/neondatabase/ai-rules/main/neon-serverless.mdc",
        "description": "Serverless database connection patterns and pooling",
        "priority": 1,
        "required": true
      }
    ],
    "setupComplete": "Serverless connection setup is complete! Your AI assistant now has Neon serverless best practices."
  },
  "neon-toolkit": {
    "skillName": "Neon Toolkit (Ephemeral Databases)",
    "mdcFiles": [
      {
        "filename": "neon-toolkit.mdc",
        "rawUrl": "https://raw.githubusercontent.com/neondatabase/ai-rules/main/neon-toolkit.mdc",
        "description": "Guidelines for creating ephemeral databases for testing",
        "priority": 1,
        "required": true
      }
    ],
    "setupComplete": "Toolkit setup is complete! Your AI assistant can now help with ephemeral database workflows."
  },
  "neon-auth": {
    "skillName": "Neon Auth Integration",
    "mdcFiles": [
      {
        "filename": "neon-auth.mdc",
        "rawUrl": "https://raw.githubusercontent.com/neondatabase/ai-rules/main/neon-auth.mdc",
        "description": "Authentication patterns with Stack Auth and Neon",
        "priority": 1,
        "required": true
      }
    ],
    "setupComplete": "Auth setup is complete! Your AI assistant now understands Neon Auth patterns."
  }
}
```

### Success Criteria

#### Automated Verification
- [ ] `skill-metadata.json` exists and is valid JSON
- [ ] All current skills (drizzle, serverless, toolkit) are mapped
- [ ] All raw GitHub URLs are valid and return 200
- [ ] JSON validates against schema (if we create one)

#### Manual Verification
- [ ] Metadata includes all essential fields for each skill
- [ ] URLs point to correct `.mdc` files
- [ ] Descriptions are clear and helpful
- [ ] Priority ordering makes sense

---

## Phase 2: Build Project Structure Detection

### Overview
Create a detection system that identifies where AI knowledge should be installed in the user's project.

### Changes Required

#### 1. Project Structure Detector
**File**: `dev-marketplace/neon-plugin/shared/project-detector.ts`
**Purpose**: Scan project and identify knowledge file locations

```typescript
export interface ProjectStructure {
  type: 'cursor' | 'claude' | 'custom' | 'none';
  knowledgePath: string;
  exists: boolean;
  detected: string[]; // What files/folders were found
  recommended: {
    path: string;
    reason: string;
  };
}

export interface DetectionResult {
  structure: ProjectStructure;
  needsInit: boolean;
  suggestedAction: string;
}

/**
 * Detects the project's AI knowledge structure
 * Checks for: .cursor/rules, CLAUDE.md, .claude/, agents.md, .ai/, etc.
 */
export async function detectProjectStructure(
  projectRoot: string
): Promise<DetectionResult> {
  // Implementation details in next phase
}
```

**Detection Priority Order:**
1. Check for `.cursor/rules/` directory (Cursor IDE)
2. Check for `CLAUDE.md` file (Claude Code convention)
3. Check for `.claude/` directory (Alternative Claude structure)
4. Check for `agents.md` file (Custom convention)
5. Check for `.ai/` directory (Generic AI folder)
6. Check for existing `.mdc` files anywhere in project
7. Fall back to "none" if nothing found

#### 2. Detection Logic Implementation

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';

export async function detectProjectStructure(
  projectRoot: string
): Promise<DetectionResult> {
  const detected: string[] = [];

  // Check .cursor/rules
  const cursorRulesPath = path.join(projectRoot, '.cursor', 'rules');
  const cursorRulesExists = await pathExists(cursorRulesPath);
  if (cursorRulesExists) {
    detected.push('.cursor/rules/');
  }

  // Check CLAUDE.md
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
  const claudeMdExists = await pathExists(claudeMdPath);
  if (claudeMdExists) {
    detected.push('CLAUDE.md');
  }

  // Check .claude/
  const claudeDirPath = path.join(projectRoot, '.claude');
  const claudeDirExists = await pathExists(claudeDirPath);
  if (claudeDirExists) {
    detected.push('.claude/');
  }

  // Check agents.md
  const agentsMdPath = path.join(projectRoot, 'agents.md');
  const agentsMdExists = await pathExists(agentsMdPath);
  if (agentsMdExists) {
    detected.push('agents.md');
  }

  // Check .ai/
  const aiDirPath = path.join(projectRoot, '.ai');
  const aiDirExists = await pathExists(aiDirPath);
  if (aiDirExists) {
    detected.push('.ai/');
  }

  // Determine project type and recommended path
  let type: ProjectStructure['type'] = 'none';
  let knowledgePath = '';
  let exists = false;

  if (cursorRulesExists) {
    type = 'cursor';
    knowledgePath = cursorRulesPath;
    exists = true;
  } else if (claudeMdExists || claudeDirExists) {
    type = 'claude';
    knowledgePath = claudeMdExists ? claudeMdPath : claudeDirPath;
    exists = true;
  } else if (agentsMdExists || aiDirExists) {
    type = 'custom';
    knowledgePath = agentsMdExists ? agentsMdPath : aiDirPath;
    exists = true;
  }

  // Determine if init is needed
  const needsInit = detected.length === 0;

  // Build recommendation
  const recommended = buildRecommendation(type, detected, projectRoot);

  // Determine suggested action
  const suggestedAction = needsInit
    ? 'Run /init to create CLAUDE.md, then add Neon knowledge'
    : `Add Neon knowledge to ${recommended.path}`;

  return {
    structure: {
      type,
      knowledgePath,
      exists,
      detected,
      recommended
    },
    needsInit,
    suggestedAction
  };
}

function buildRecommendation(
  type: ProjectStructure['type'],
  detected: string[],
  projectRoot: string
): { path: string; reason: string } {
  if (type === 'cursor') {
    return {
      path: '.cursor/rules/',
      reason: 'Cursor IDE detected - rules folder is the standard location'
    };
  } else if (type === 'claude') {
    if (detected.includes('CLAUDE.md')) {
      return {
        path: 'CLAUDE.md',
        reason: 'CLAUDE.md exists - append knowledge reference here'
      };
    } else {
      return {
        path: '.claude/',
        reason: '.claude/ directory exists - add files here'
      };
    }
  } else if (type === 'custom') {
    return {
      path: detected[0],
      reason: `Custom AI setup detected at ${detected[0]}`
    };
  } else {
    return {
      path: 'CLAUDE.md',
      reason: 'No AI structure found - CLAUDE.md is recommended'
    };
  }
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
```

### Success Criteria

#### Automated Verification
- [ ] Script detects `.cursor/rules/` directory correctly
- [ ] Script detects `CLAUDE.md` file correctly
- [ ] Script detects `.claude/` directory correctly
- [ ] Script detects custom structures (agents.md, .ai/)
- [ ] Script returns correct recommendation for each case
- [ ] Unit tests pass for all detection scenarios

#### Manual Verification
- [ ] Tested on real Cursor project
- [ ] Tested on real Claude Code project
- [ ] Tested on project with no AI structure
- [ ] Recommendation text is clear and actionable

---

## Phase 3: Build File Fetcher and Installer

### Overview
Create utilities to fetch raw `.mdc` files from GitHub and install them to the user's project.

### Changes Required

#### 1. File Fetcher
**File**: `dev-marketplace/neon-plugin/shared/file-fetcher.ts`
**Purpose**: Fetch raw `.mdc` content from GitHub

```typescript
export interface FetchResult {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Fetches raw .mdc file content from GitHub
 */
export async function fetchMdcFile(rawUrl: string): Promise<FetchResult> {
  try {
    const response = await fetch(rawUrl);

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch: ${response.statusText} (${response.status})`
      };
    }

    const content = await response.text();

    return {
      success: true,
      content
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

#### 2. File Installer
**File**: `dev-marketplace/neon-plugin/shared/file-installer.ts`
**Purpose**: Install fetched files to the correct location

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';

export interface InstallOptions {
  projectRoot: string;
  targetPath: string;
  filename: string;
  content: string;
  addHeader: boolean;
}

export interface InstallResult {
  success: boolean;
  installedPath?: string;
  error?: string;
}

/**
 * Installs .mdc file to the project with optional header
 */
export async function installMdcFile(
  options: InstallOptions
): Promise<InstallResult> {
  const { projectRoot, targetPath, filename, content, addHeader } = options;

  try {
    // Determine full installation path
    const fullPath = path.isAbsolute(targetPath)
      ? targetPath
      : path.join(projectRoot, targetPath);

    // Check if target is a directory or file
    const stats = await fs.stat(fullPath).catch(() => null);
    const isDirectory = stats?.isDirectory() ?? targetPath.endsWith('/');

    let finalPath: string;

    if (isDirectory) {
      // Target is directory - add filename
      await fs.mkdir(fullPath, { recursive: true });
      finalPath = path.join(fullPath, filename);
    } else {
      // Target is file (like CLAUDE.md) - append content
      finalPath = fullPath;
    }

    // Prepare content with optional header
    let finalContent = content;

    if (addHeader) {
      const header = generateHeader(filename);
      finalContent = `${header}\n\n${content}`;
    }

    // Install based on target type
    if (isDirectory) {
      // Write to new file in directory
      await fs.writeFile(finalPath, finalContent, 'utf-8');
    } else {
      // Append to existing file (like CLAUDE.md)
      const exists = await pathExists(finalPath);

      if (exists) {
        // Append with separator
        const separator = '\n\n---\n\n';
        const existingContent = await fs.readFile(finalPath, 'utf-8');
        finalContent = `${existingContent}${separator}${finalContent}`;
      }

      await fs.writeFile(finalPath, finalContent, 'utf-8');
    }

    return {
      success: true,
      installedPath: finalPath
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateHeader(filename: string): string {
  return `<!--
Source: https://github.com/neondatabase/ai-rules/blob/main/${filename}
Auto-installed by Neon Claude Code Plugin
Last updated: ${new Date().toISOString().split('T')[0]}
-->`;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
```

### Success Criteria

#### Automated Verification
- [ ] File fetcher successfully retrieves `.mdc` content from GitHub
- [ ] File fetcher handles 404 errors gracefully
- [ ] File fetcher handles network errors gracefully
- [ ] Installer creates directories if they don't exist
- [ ] Installer writes files to directory targets correctly
- [ ] Installer appends to file targets correctly
- [ ] Installer adds source headers correctly
- [ ] Unit tests pass for fetcher and installer

#### Manual Verification
- [ ] Fetched content matches source `.mdc` files
- [ ] Installed files are readable and well-formatted
- [ ] Headers provide clear source attribution
- [ ] No file corruption or encoding issues

---

## Phase 4: Build User Interaction Flow

### Overview
Create the user-facing workflow that asks for permission and guides installation.

### Changes Required

#### 1. Knowledge Installer Main Module
**File**: `dev-marketplace/neon-plugin/shared/knowledge-installer.ts`
**Purpose**: Main entry point that orchestrates the workflow

```typescript
import { detectProjectStructure } from './project-detector';
import { fetchMdcFile } from './file-fetcher';
import { installMdcFile } from './file-installer';
import skillMetadata from './skill-metadata.json';

export interface InstallerOptions {
  skillName: string;
  projectRoot: string;
  autoInstall?: boolean; // For testing
}

export interface InstallerResult {
  success: boolean;
  message: string;
  installedFiles: string[];
  skipped: string[];
}

/**
 * Main knowledge installer workflow
 * Call this at the end of any skill execution
 */
export async function installKnowledgeForSkill(
  options: InstallerOptions
): Promise<InstallerResult> {
  const { skillName, projectRoot, autoInstall = false } = options;

  // 1. Get skill metadata
  const metadata = skillMetadata[skillName];

  if (!metadata) {
    return {
      success: false,
      message: `Skill "${skillName}" not found in metadata`,
      installedFiles: [],
      skipped: []
    };
  }

  // 2. Detect project structure
  const detection = await detectProjectStructure(projectRoot);

  // 3. Check if init is needed
  if (detection.needsInit) {
    return {
      success: false,
      message: `No AI knowledge structure found. ${detection.suggestedAction}`,
      installedFiles: [],
      skipped: []
    };
  }

  // 4. Ask user if they want to install (unless autoInstall)
  if (!autoInstall) {
    const userWantsInstall = await promptUser(metadata, detection);

    if (!userWantsInstall) {
      return {
        success: true,
        message: 'Knowledge installation skipped by user',
        installedFiles: [],
        skipped: metadata.mdcFiles.map(f => f.filename)
      };
    }
  }

  // 5. Install files
  const installedFiles: string[] = [];
  const skipped: string[] = [];

  for (const fileInfo of metadata.mdcFiles) {
    // Skip optional files if user doesn't want them
    if (!fileInfo.required && !autoInstall) {
      const wantsOptional = await promptOptionalFile(fileInfo);
      if (!wantsOptional) {
        skipped.push(fileInfo.filename);
        continue;
      }
    }

    // Fetch file
    const fetchResult = await fetchMdcFile(fileInfo.rawUrl);

    if (!fetchResult.success) {
      console.error(`Failed to fetch ${fileInfo.filename}: ${fetchResult.error}`);
      skipped.push(fileInfo.filename);
      continue;
    }

    // Install file
    const installResult = await installMdcFile({
      projectRoot,
      targetPath: detection.structure.recommended.path,
      filename: fileInfo.filename,
      content: fetchResult.content!,
      addHeader: true
    });

    if (!installResult.success) {
      console.error(`Failed to install ${fileInfo.filename}: ${installResult.error}`);
      skipped.push(fileInfo.filename);
      continue;
    }

    installedFiles.push(installResult.installedPath!);
  }

  // 6. Return result
  const message = buildCompletionMessage(
    metadata,
    detection,
    installedFiles,
    skipped
  );

  return {
    success: installedFiles.length > 0,
    message,
    installedFiles,
    skipped
  };
}

async function promptUser(
  metadata: any,
  detection: any
): Promise<boolean> {
  // In real implementation, use Claude Code's prompt system
  // For now, return true to auto-install
  console.log(`\nWould you like to add ${metadata.skillName} best practices to your project?`);
  console.log(`This will install knowledge files to: ${detection.structure.recommended.path}`);
  console.log(`Files: ${metadata.mdcFiles.map(f => f.filename).join(', ')}`);

  // TODO: Implement actual user prompt
  return true;
}

async function promptOptionalFile(fileInfo: any): Promise<boolean> {
  console.log(`\nOptional: ${fileInfo.filename}`);
  console.log(`Description: ${fileInfo.description}`);

  // TODO: Implement actual user prompt
  return false; // Default to no for optional files
}

function buildCompletionMessage(
  metadata: any,
  detection: any,
  installedFiles: string[],
  skipped: string[]
): string {
  let message = `${metadata.setupComplete}\n\n`;

  message += `Installed to: ${detection.structure.recommended.path}\n`;
  message += `Files added: ${installedFiles.length}\n`;

  if (installedFiles.length > 0) {
    message += `\nInstalled files:\n`;
    installedFiles.forEach(file => {
      message += `  - ${file}\n`;
    });
  }

  if (skipped.length > 0) {
    message += `\nSkipped files:\n`;
    skipped.forEach(file => {
      message += `  - ${file}\n`;
    });
  }

  message += `\nYour AI assistant can now reference Neon best practices for ${metadata.skillName}!`;

  return message;
}
```

#### 2. Integrate into Skill Workflows
**Files**: Each `SKILL.md` in skills directory
**Changes**: Add call to knowledge installer at the end

**Example for neon-drizzle/SKILL.md:**

```markdown
## Workflow Completion

After completing the Drizzle setup, I can optionally install Neon + Drizzle best practices to your project so your AI assistant always has access to them.

This will add reference documentation to your project's AI knowledge base (like `.cursor/rules/` or `CLAUDE.md`).

Would you like me to do that now?

---

**Implementation note for Claude:**
After completing the skill workflow, call:

```typescript
import { installKnowledgeForSkill } from '../shared/knowledge-installer';

const result = await installKnowledgeForSkill({
  skillName: 'neon-drizzle',
  projectRoot: process.cwd()
});

console.log(result.message);
```
```

### Success Criteria

#### Automated Verification
- [ ] Knowledge installer can be called from any skill
- [ ] Installer detects project structure correctly
- [ ] Installer handles "no structure" case gracefully
- [ ] Installer fetches and installs files successfully
- [ ] Installer generates appropriate completion messages
- [ ] Unit tests pass for full workflow

#### Manual Verification
- [ ] User prompts are clear and helpful
- [ ] Installation process provides good feedback
- [ ] Completion message is informative
- [ ] Files are installed to correct locations
- [ ] Optional files can be skipped

---

## Phase 5: Create CLI Wrapper Script

### Overview
Create a standalone CLI script for testing and manual installation outside of skills.

### Changes Required

#### 1. CLI Script
**File**: `dev-marketplace/neon-plugin/shared/cli-install-knowledge.ts`
**Purpose**: Standalone script for testing and manual use

```typescript
#!/usr/bin/env node

import { installKnowledgeForSkill } from './knowledge-installer';
import * as process from 'process';

const AVAILABLE_SKILLS = [
  'neon-drizzle',
  'neon-serverless',
  'neon-toolkit',
  'neon-auth'
];

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  const skillName = args[0];
  const projectRoot = args[1] || process.cwd();

  if (!AVAILABLE_SKILLS.includes(skillName)) {
    console.error(`Error: Unknown skill "${skillName}"`);
    console.error(`Available skills: ${AVAILABLE_SKILLS.join(', ')}`);
    process.exit(1);
  }

  console.log(`Installing knowledge for skill: ${skillName}`);
  console.log(`Target project: ${projectRoot}\n`);

  try {
    const result = await installKnowledgeForSkill({
      skillName,
      projectRoot,
      autoInstall: false
    });

    console.log('\n' + result.message);

    if (!result.success) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Installation failed:', error);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Neon Knowledge Installer

Usage:
  npx tsx cli-install-knowledge.ts <skill-name> [project-root]

Arguments:
  skill-name    Name of the Neon skill (required)
  project-root  Path to target project (default: current directory)

Available Skills:
  ${AVAILABLE_SKILLS.map(s => `  - ${s}`).join('\n')}

Examples:
  # Install Drizzle knowledge to current project
  npx tsx cli-install-knowledge.ts neon-drizzle

  # Install to specific project
  npx tsx cli-install-knowledge.ts neon-drizzle /path/to/project

  # Install serverless knowledge
  npx tsx cli-install-knowledge.ts neon-serverless
  `);
}

main();
```

#### 2. Package.json Scripts
**File**: `dev-marketplace/neon-plugin/package.json`
**Changes**: Add convenience scripts

```json
{
  "scripts": {
    "install-knowledge": "tsx shared/cli-install-knowledge.ts",
    "test:installer": "tsx shared/__tests__/knowledge-installer.test.ts"
  }
}
```

### Success Criteria

#### Automated Verification
- [ ] CLI script runs without errors
- [ ] CLI script accepts correct arguments
- [ ] CLI script validates skill names
- [ ] CLI script provides helpful error messages
- [ ] CLI script can be run with `npx tsx`

#### Manual Verification
- [ ] Help text is clear and complete
- [ ] CLI successfully installs knowledge to test project
- [ ] CLI works from any directory
- [ ] Error messages guide user to correct usage

---

## Phase 6: Documentation and Examples

### Overview
Document the system and provide examples for contributors.

### Changes Required

#### 1. Main README Update
**File**: `dev-marketplace/neon-plugin/README.md`
**Changes**: Add section about knowledge installation

```markdown
## Knowledge Installation

After completing a skill workflow, the Neon plugin can optionally install best practices documentation to your project's AI knowledge base.

### Supported Project Types

The installer automatically detects:
- **Cursor IDE**: Installs to `.cursor/rules/`
- **Claude Code**: Appends to `CLAUDE.md` or installs to `.claude/`
- **Custom**: Detects `agents.md`, `.ai/`, or other custom locations

### How It Works

1. At the end of a skill workflow, you'll be asked if you want to install knowledge
2. The installer detects your project's AI structure
3. Relevant `.mdc` files are fetched from the Neon AI rules repository
4. Files are installed with source attribution headers
5. Your AI assistant can now reference Neon best practices automatically

### Manual Installation

You can also install knowledge manually:

```bash
npm run install-knowledge neon-drizzle
npm run install-knowledge neon-serverless /path/to/project
```

### For Skill Developers

To add knowledge installation to a new skill:

```typescript
import { installKnowledgeForSkill } from '../shared/knowledge-installer';

// At the end of your skill workflow:
const result = await installKnowledgeForSkill({
  skillName: 'your-skill-name',
  projectRoot: process.cwd()
});

console.log(result.message);
```

Then add your skill to `shared/skill-metadata.json`.
```

#### 2. Developer Guide
**File**: `dev-marketplace/neon-plugin/KNOWLEDGE_INSTALLER_GUIDE.md`
**Purpose**: Detailed guide for contributors

```markdown
# Knowledge Installer Developer Guide

## Overview

The Knowledge Installer is a universal system for adding Neon best practices to user projects. It's designed to work with any skill and any project structure.

## Architecture

### Components

1. **skill-metadata.json** - Maps skills to their documentation files
2. **project-detector.ts** - Detects where to install files
3. **file-fetcher.ts** - Fetches raw .mdc files from GitHub
4. **file-installer.ts** - Installs files to the project
5. **knowledge-installer.ts** - Orchestrates the workflow

### Data Flow

```
Skill Completion
  ↓
installKnowledgeForSkill()
  ↓
Detect Project Structure
  ↓
Prompt User (optional)
  ↓
Fetch .mdc Files from GitHub
  ↓
Install to Detected Location
  ↓
Report Results
```

## Adding a New Skill

### 1. Add Metadata

Edit `shared/skill-metadata.json`:

```json
{
  "your-skill-name": {
    "skillName": "Your Skill Display Name",
    "mdcFiles": [
      {
        "filename": "your-file.mdc",
        "rawUrl": "https://raw.githubusercontent.com/neondatabase/ai-rules/main/your-file.mdc",
        "description": "Brief description",
        "priority": 1,
        "required": true
      }
    ],
    "setupComplete": "Success message to show user"
  }
}
```

### 2. Call Installer in Skill

Add to the end of your `SKILL.md` workflow:

```typescript
import { installKnowledgeForSkill } from '../shared/knowledge-installer';

const result = await installKnowledgeForSkill({
  skillName: 'your-skill-name',
  projectRoot: process.cwd()
});

if (result.success) {
  console.log(result.message);
} else {
  console.error('Knowledge installation failed:', result.message);
}
```

### 3. Test

```bash
npm run install-knowledge your-skill-name
```

## Supported Project Structures

| Type | Detection | Install Location |
|------|-----------|------------------|
| Cursor | `.cursor/rules/` exists | `.cursor/rules/*.mdc` |
| Claude (file) | `CLAUDE.md` exists | Append to `CLAUDE.md` |
| Claude (dir) | `.claude/` exists | `.claude/*.mdc` |
| Custom | `agents.md` or `.ai/` exists | Same location |
| None | Nothing detected | Suggest running `/init` |

## Testing

### Unit Tests

```bash
npm run test:installer
```

### Integration Tests

```bash
# Test on real projects
npm run install-knowledge neon-drizzle ../test-cursor-project
npm run install-knowledge neon-serverless ../test-claude-project
```

### Manual Testing Checklist

- [ ] Test with Cursor project
- [ ] Test with Claude Code project (CLAUDE.md)
- [ ] Test with Claude Code project (.claude/)
- [ ] Test with no AI structure
- [ ] Test with custom structure
- [ ] Verify file contents are correct
- [ ] Verify headers are added
- [ ] Verify completion messages

## Troubleshooting

### Files Not Installing

- Check network connection (files are fetched from GitHub)
- Verify URLs in `skill-metadata.json`
- Check file permissions in target directory

### Wrong Detection

- Add more detection patterns in `project-detector.ts`
- Update priority order if needed

### User Prompts Not Working

- Implement actual prompt system (currently console.log)
- Integrate with Claude Code's prompt API
```

### Success Criteria

#### Automated Verification
- [ ] README includes knowledge installer section
- [ ] Developer guide is complete and accurate
- [ ] All code examples are syntactically correct
- [ ] Links to source files are valid

#### Manual Verification
- [ ] Documentation is clear to new contributors
- [ ] Examples are easy to follow
- [ ] Troubleshooting section covers common issues
- [ ] README provides good user experience overview

---

## Testing Strategy

### Unit Tests

**File**: `dev-marketplace/neon-plugin/shared/__tests__/knowledge-installer.test.ts`

Test coverage:
- Project structure detection (all 5+ types)
- File fetching (success, 404, network error)
- File installation (directory, file append, headers)
- Full workflow (mock user responses)
- Metadata validation (all skills have valid configs)

### Integration Tests

**File**: `dev-marketplace/neon-plugin/shared/__tests__/integration.test.ts`

Test scenarios:
- Install to real Cursor project structure
- Install to real Claude Code project structure
- Install to project with no AI structure
- Install multiple times (idempotency)
- Install optional files

### Manual Testing Steps

1. Create test projects with different structures:
   - Cursor project with `.cursor/rules/`
   - Claude project with `CLAUDE.md`
   - Claude project with `.claude/` directory
   - Empty project with no AI structure

2. Test each skill:
   ```bash
   npm run install-knowledge neon-drizzle test-projects/cursor-project
   npm run install-knowledge neon-serverless test-projects/claude-project
   npm run install-knowledge neon-toolkit test-projects/empty-project
   ```

3. Verify results:
   - Files exist in correct locations
   - Content matches source `.mdc` files
   - Headers are present and correct
   - No duplicate installations
   - Completion messages are accurate

4. Test error handling:
   - Invalid skill name
   - Network disconnected
   - Invalid project path
   - Permission denied

## Performance Considerations

- **Network requests**: Fetch files once and cache during session
- **File operations**: Use async I/O throughout
- **Detection**: Cache detection results for same project
- **User prompts**: Don't block on optional files if user declines all

## Migration Notes

### For Existing Skills

No migration needed for existing skills - this is an additive feature. To opt in:

1. Add metadata to `skill-metadata.json`
2. Add installer call at end of skill workflow
3. Test with real project

### For Users

No migration needed - this is opt-in. Users can:
- Accept installation during skill execution
- Run manual install later
- Skip entirely

## References

- Original request: `/create-plan` command with universal workflow requirements
- Source `.mdc` files: Repository root (13 files)
- Skills directory: `dev-marketplace/neon-plugin/skills/`
- Claude Code docs: https://docs.claude.com/en/docs/claude-code/skills
