import path from 'path';
import { fileURLToPath } from 'url';
import { runClaudeCodeEval, scorers } from 'code-agent-eval';
import skillKnowledgeMap from '../../skills/add-neon-docs/skill-knowledge-map.json' with { type: 'json' };

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common configurations
const COMMON_CONFIG = {
  projectDir: path.resolve(__dirname, './eval-input'),
  iterations: 10,
  claudeCodeOptions: {
    plugins: [
      {
        type: 'local' as const,
        path: path.resolve(__dirname, '../..'),
      },
    ],
  },
  resultsDir: path.join(__dirname, './eval-results'),
  execution: { mode: 'parallel' as const },
};

const GITHUB_BASE_URL =
  'https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main';

// Reusable scorer factories
function createSkillUsedScorer(): ReturnType<typeof scorers.createScorer> {
  return scorers.createScorer(
    'add-neon-docs-skill-used',
    async ({ agentOutput }) => {
      const messages = JSON.parse(agentOutput);

      // Check if any assistant message contains the Skill tool_use
      const skillUsed = messages.some((msg: any) => {
        // Check for assistant messages with content
        if (msg.type !== 'assistant' || !msg.message?.content) {
          return false;
        }

        // Check if any content item is a Skill tool use with our command
        return msg.message.content.some(
          (content: any) =>
            content.type === 'tool_use' &&
            content.name === 'Skill' &&
            content.input?.command?.includes('neon-plugin:add-neon-docs')
        );
      });

      if (skillUsed) {
        return {
          score: 1.0,
          reason: 'add-neon-docs skill used',
        };
      } else {
        return {
          score: 0.0,
          reason: 'add-neon-docs skill not used',
        };
      }
    }
  );
}

function createDynamicClaudeMdScorer(): ReturnType<
  typeof scorers.createScorer
> {
  return scorers.createScorer(
    'claude-md-added-to-project',
    async ({ workingDir, promptId }) => {
      const fs = await import('fs/promises');
      const path = await import('path');

      // Find skill key by matching promptId prefix (e.g., 'neon-drizzle-docs' matches 'neon-drizzle')
      const skillKey = Object.keys(skillKnowledgeMap).find(key =>
        promptId.startsWith(key)
      ) as keyof typeof skillKnowledgeMap | undefined;

      if (!skillKey) {
        return {
          score: 0.0,
          reason: `Unknown skill in promptId: ${promptId}`,
        };
      }

      const config = skillKnowledgeMap[skillKey];

      // Get the required MDC file from the skill knowledge map
      const requiredFile = config.files.find((f) => f.required);
      if (!requiredFile) {
        return {
          score: 0.0,
          reason: `No required file found for skill: ${skillKey}`,
        };
      }

      try {
        // Try both common names
        let content: string;
        try {
          content = await fs.readFile(
            path.join(workingDir, 'CLAUDE.md'),
            'utf-8'
          );
        } catch {
          content = await fs.readFile(
            path.join(workingDir, 'claude.md'),
            'utf-8'
          );
        }

        const expectedUrl = `${GITHUB_BASE_URL}/${requiredFile.filename}`;
        const hasDocReference = content.includes(expectedUrl);

        if (hasDocReference) {
          return {
            score: 1.0,
            reason: `CLAUDE.md exists with correct ${config.displayName} documentation reference`,
          };
        } else {
          return {
            score: 0.5,
            reason: `CLAUDE.md exists but missing ${config.displayName} documentation reference`,
            metadata: {
              hint: `Expected URL: ${expectedUrl}`,
            },
          };
        }
      } catch (error) {
        return {
          score: 0.0,
          reason: 'CLAUDE.md file not found in project',
        };
      }
    }
  );
}

// Single unified eval (replaces all 3 separate functions)
async function runAllNeonDocsEvals() {
  console.log('Running all add-neon-docs skill evaluations...\n');

  const start = Date.now();

  await runClaudeCodeEval({
    name: 'eval-add-neon-docs-skills',
    prompts: [
      { id: 'neon-drizzle-docs', prompt: 'Add docs about neon and drizzle.' },
      {
        id: 'neon-drizzle-best-practices',
        prompt: 'Add best practices docs about neon and drizzle.',
      },
      { id: 'neon-serverless-docs', prompt: 'Add docs about neon serverless.' },
      {
        id: 'neon-serverless-best-practices',
        prompt: 'Add best practices docs about neon serverless driver.',
      },
      { id: 'neon-toolkit-docs', prompt: 'Add docs about neon toolkit.' },
      {
        id: 'neon-toolkit-best-practices',
        prompt:
          'Add best practices docs about neon toolkit for ephemeral databases.',
      },
    ],
    ...COMMON_CONFIG,
    scorers: [
      scorers.buildSuccess(),
      createSkillUsedScorer(),
      createDynamicClaudeMdScorer(), // Uses promptId internally
    ],
  });

  const totalDuration = (Date.now() - start) / 1000;
  console.log(`\nAll evaluations completed in ${totalDuration}s!`);
}

runAllNeonDocsEvals().catch(console.error);
