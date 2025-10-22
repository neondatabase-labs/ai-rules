/**
 * Create Ephemeral Database Script
 *
 * Creates a temporary Neon database for testing or development.
 * Run with: NEON_API_KEY=your_key npx ts-node create-ephemeral-db.ts
 *
 * Outputs the database connection string and saves it to a .env file.
 */

import { NeonToolkit } from '@neondatabase/toolkit';
import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.NEON_API_KEY;

if (!API_KEY) {
  console.error('❌ NEON_API_KEY environment variable is not set');
  console.error('\nSet it with:');
  console.error('  export NEON_API_KEY=your_api_key');
  process.exit(1);
}

async function createEphemeralDatabase() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Neon Ephemeral Database Creator');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    console.log('🔑 Initializing Neon Toolkit...');
    const neon = new NeonToolkit({ apiKey: API_KEY });

    console.log('📦 Creating ephemeral database...');
    const db = await neon.createEphemeralDatabase();

    console.log('\n✅ Ephemeral database created successfully!\n');

    // Display database info
    console.log('📊 Database Information:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Connection String: ${db.url}`);
    console.log(`Database Name: ${new URL(db.url).pathname.slice(1)}`);
    console.log(`Host: ${new URL(db.url).hostname}`);
    console.log('\n');

    // Save to .env.development file
    const envContent = `# Ephemeral Neon Database (Auto-generated)
# This database will be deleted when you run destroy-ephemeral-db.ts
DATABASE_URL="${db.url}"
`;

    const envPath = path.join(process.cwd(), '.env.development');
    fs.writeFileSync(envPath, envContent);

    console.log(`📝 Saved to: ${envPath}`);
    console.log('\n💡 Usage:');
    console.log('   1. Load environment: source .env.development');
    console.log('   2. Run your tests: npm test');
    console.log('   3. Cleanup: npx ts-node destroy-ephemeral-db.ts\n');

    // Also print to console for CI/CD usage
    console.log('🔗 For CI/CD, use this connection string:');
    console.log(db.url);
    console.log('\n');

    // Store database ID for cleanup
    const cleanupInfo = {
      timestamp: new Date().toISOString(),
      connectionUrl: db.url,
      deleteCommand: 'npx ts-node destroy-ephemeral-db.ts',
    };

    const infoPath = path.join(process.cwd(), '.ephemeral-db-info.json');
    fs.writeFileSync(infoPath, JSON.stringify(cleanupInfo, null, 2));
    console.log(`📋 Database info saved to: ${infoPath}`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Ready to use!\n');

    return db.url;
  } catch (error) {
    console.error('❌ Failed to create ephemeral database');
    console.error(`Error: ${(error as any).message}`);

    console.log('\n💡 Troubleshooting:');
    console.log('   • Check your NEON_API_KEY is valid');
    console.log('   • Verify API key permissions in Neon console');
    console.log('   • Check network connectivity');
    console.log('   • Review Neon API status at https://status.neon.tech\n');

    process.exit(1);
  }
}

createEphemeralDatabase();
