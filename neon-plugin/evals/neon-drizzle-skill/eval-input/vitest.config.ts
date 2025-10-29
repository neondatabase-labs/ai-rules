import { defineConfig } from 'vitest/config';
import path from 'path';
import { config as loadEnv } from 'dotenv';

// Load .env.local file before running tests                                                                                               │
loadEnv({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  test: {
    environment: 'node',
  },
});
