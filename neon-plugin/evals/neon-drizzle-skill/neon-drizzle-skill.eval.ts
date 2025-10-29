import path from 'path';
import { fileURLToPath } from 'url';
import { runClaudeCodeEval, scorers } from 'code-agent-eval';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function evalNeonDrizzleSkill() {
  console.log('Comparing execution modes...\n');
  const start = Date.now();

  await runClaudeCodeEval({
    name: 'eval-neon-drizzle-skill',
    prompts: [
      {
        id: 'build-todo-app',
        prompt:
          'I want to build a todo application with Neon and Drizzle. Create an integration test using drizzle syntax in __tests__/ that verifies you can add a todo to the database and query it back successfully.',
      },

      {
        id: 'build-notes-app',
        prompt:
          'I want to create a new notes application with Neon, Drizzle and Next.js.  Create an integration test using drizzle syntax in __tests__/ that verifies you can add a note to the database and query it back successfully.',
      },
    ],
    projectDir: path.resolve(__dirname, './eval-input'),
    iterations: 10,
    scorers: [
      scorers.buildSuccess(),
      scorers.createScorer(
        'neon-drizzle-skill-used',
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
                content.input?.command?.includes('neon-plugin:neon-drizzle')
            );
          });

          if (skillUsed) {
            return {
              score: 1.0,
              reason: 'neon-drizzle skill used',
            };
          } else {
            return {
              score: 0.0,
              reason: 'neon-drizzle skill not used',
            };
          }
        }
      ),
      scorers.testSuccess(),
    ],
    claudeCodeOptions: {
      plugins: [
        {
          type: 'local',
          path: path.resolve(__dirname, '../..'),
        },
      ],
      systemPrompt: `Next.js 15+ App Router: params are Promises. Always use:
    async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
    }
    Never use old synchronous params pattern: { params: { id: string } }`,
    },
    resultsDir: path.join(__dirname, './eval-results'),
    execution: { mode: 'parallel-limit', concurrency: 6 },
    tempDirCleanup: 'on-failure',
  });

  console.log(`Duration: ${(Date.now() - start) / 1000}s\n`);
}

evalNeonDrizzleSkill().catch(console.error);
