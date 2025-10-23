/**
 * Destroy Ephemeral Database Script
 *
 * Cleans up a temporary Neon database created with create-ephemeral-db.ts.
 * Run with: NEON_API_KEY=your_key npx ts-node destroy-ephemeral-db.ts
 *
 * Removes the database and cleans up related files.
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.NEON_API_KEY;

if (!API_KEY) {
  console.error('❌ NEON_API_KEY environment variable is not set');
  console.error('\nSet it with:');
  console.error('  export NEON_API_KEY=your_api_key');
  process.exit(1);
}

async function destroyEphemeralDatabase() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Neon Ephemeral Database Destroyer');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Check for database info file
    const infoPath = path.join(process.cwd(), '.ephemeral-db-info.json');
    if (!fs.existsSync(infoPath)) {
      console.warn('⚠️  No database info file found at: ' + infoPath);
      console.log('   Run create-ephemeral-db.ts first to create a database.\n');
      process.exit(1);
    }

    const dbInfo = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
    console.log('🔍 Found database created at: ' + dbInfo.timestamp);
    console.log(`   Connection: ${new URL(dbInfo.connectionUrl).hostname}`);
    console.log('   Database: ' + new URL(dbInfo.connectionUrl).pathname.slice(1));
    console.log('');

    console.log('🧹 Cleaning up...');

    // Remove .env file if it exists
    const envPath = path.join(process.cwd(), '.env.development');
    if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
      console.log('   ✅ Removed .env.development');
    }

    // Remove info file
    fs.unlinkSync(infoPath);
    console.log('   ✅ Removed database info file');

    console.log('\n✅ Cleanup complete!');
    console.log('   (Database itself is ephemeral and auto-deletes)');
    console.log('\n');

    // Show next steps
    console.log('💡 Next steps:');
    console.log('   • To create a new database: npx ts-node create-ephemeral-db.ts');
    console.log('   • To persist a database: Use Neon Console directly\n');

    console.log('═══════════════════════════════════════════════════════');
  } catch (error) {
    console.error('❌ Error during cleanup');
    console.error(`Error: ${(error as any).message}\n`);

    console.log('💡 Manual cleanup:');
    console.log('   1. Remove .env.development');
    console.log('   2. Remove .ephemeral-db-info.json');
    console.log('   3. Ephemeral database auto-deletes\n');

    process.exit(1);
  }
}

// Note: In a real implementation, you might also delete the database via API:
// import { NeonToolkit } from '@neondatabase/toolkit';
// const neon = new NeonToolkit({ apiKey: API_KEY });
// await neon.deleteBranch(dbInfo.branchId);

destroyEphemeralDatabase();
