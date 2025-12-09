/**
 * Validate Neon JS SDK Setup Script
 *
 * Verifies that the Neon JS SDK is properly configured with both
 * authentication and data API endpoints.
 *
 * Run with: npx ts-node validate-setup.ts
 *
 * This script will:
 * 1. Check environment variables are set
 * 2. Verify URL formats for auth and data API
 * 3. Test auth endpoint connectivity
 * 4. Test data API endpoint connectivity
 * 5. Check for required files
 */

import * as fs from "fs";
import * as path from "path";

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

async function validateSetup(): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const cwd = process.cwd();

  console.log("🔍 Validating Neon JS SDK setup...\n");

  // 1. Check environment variables
  console.log("📋 Checking environment variables...");

  const envFiles = [".env.local", ".env"];
  let envFound = false;
  let authUrl: string | undefined;
  let dataApiUrl: string | undefined;

  for (const envFile of envFiles) {
    const envPath = path.join(cwd, envFile);
    if (fs.existsSync(envPath)) {
      envFound = true;
      const content = fs.readFileSync(envPath, "utf-8");

      // Check for auth URL
      const authBaseMatch = content.match(/NEON_AUTH_BASE_URL=(.+)/);
      const authPublicMatch = content.match(/NEXT_PUBLIC_NEON_AUTH_URL=(.+)/);
      const dataApiMatch = content.match(/NEON_DATA_API_URL=(.+)/);

      if (authBaseMatch) {
        authUrl = authBaseMatch[1].trim();
        console.log(`   ✅ NEON_AUTH_BASE_URL found in ${envFile}`);
      } else {
        errors.push(`NEON_AUTH_BASE_URL not found in ${envFile}`);
      }

      if (authPublicMatch) {
        console.log(`   ✅ NEXT_PUBLIC_NEON_AUTH_URL found in ${envFile}`);
      } else {
        warnings.push(`NEXT_PUBLIC_NEON_AUTH_URL not found - client-side auth may not work`);
      }

      if (dataApiMatch) {
        dataApiUrl = dataApiMatch[1].trim();
        console.log(`   ✅ NEON_DATA_API_URL found in ${envFile}`);
      } else {
        errors.push(`NEON_DATA_API_URL not found in ${envFile}`);
      }

      break;
    }
  }

  if (!envFound) {
    errors.push("No .env.local or .env file found");
  }

  // 2. Validate URL formats
  console.log("\n📋 Validating URL formats...");

  if (authUrl) {
    if (authUrl.includes("neonauth") && authUrl.endsWith("/auth")) {
      console.log("   ✅ Auth URL format is valid");
    } else {
      warnings.push(`Auth URL may be incorrect. Expected format: https://ep-xxx.neonauth.*.aws.neon.build/dbname/auth`);
    }
  }

  if (dataApiUrl) {
    if (dataApiUrl.includes("apirest") && dataApiUrl.endsWith("/rest/v1")) {
      console.log("   ✅ Data API URL format is valid");
    } else {
      warnings.push(`Data API URL may be incorrect. Expected format: https://ep-xxx.apirest.*.aws.neon.build/dbname/rest/v1`);
    }
  }

  // 3. Test auth endpoint connectivity
  console.log("\n📋 Testing auth endpoint connectivity...");

  if (authUrl) {
    try {
      const response = await fetch(`${authUrl}/session`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok || response.status === 401) {
        console.log("   ✅ Auth endpoint is reachable");
      } else {
        warnings.push(`Auth endpoint returned status ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("ECONNREFUSED")) {
        errors.push(`Cannot connect to auth endpoint: ${errorMessage}`);
      } else {
        warnings.push(`Could not verify auth endpoint: ${errorMessage}`);
      }
    }
  }

  // 4. Test data API endpoint connectivity
  console.log("\n📋 Testing data API endpoint connectivity...");

  if (dataApiUrl) {
    try {
      const response = await fetch(dataApiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // Data API typically returns 401 without auth or 200 with public tables
      if (response.ok || response.status === 401 || response.status === 404) {
        console.log("   ✅ Data API endpoint is reachable");
      } else {
        warnings.push(`Data API endpoint returned status ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("ECONNREFUSED")) {
        errors.push(`Cannot connect to data API endpoint: ${errorMessage}`);
      } else {
        warnings.push(`Could not verify data API endpoint: ${errorMessage}`);
      }
    }
  }

  // 5. Check for required files
  console.log("\n📋 Checking project structure...");

  // Check API route
  const apiRoutePath = path.join(cwd, "app/api/auth/[...path]/route.ts");
  const apiRouteAltPath = path.join(cwd, "app/api/auth/[...path]/route.js");

  if (fs.existsSync(apiRoutePath) || fs.existsSync(apiRouteAltPath)) {
    console.log("   ✅ API route handler found");
  } else {
    errors.push("API route handler not found at app/api/auth/[...path]/route.ts");
  }

  // Check for db client
  const dbClientPaths = [
    "lib/db/client.ts",
    "lib/db/client.js",
    "src/lib/db/client.ts",
    "src/lib/db/client.js",
  ];

  const dbClientFound = dbClientPaths.some((p) => fs.existsSync(path.join(cwd, p)));

  if (dbClientFound) {
    console.log("   ✅ Database client file found");
  } else {
    warnings.push("Database client file not found at lib/db/client.ts - may be in different location");
  }

  // Check for package installation
  const packageJsonPath = path.join(cwd, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (deps["@neondatabase/neon-js"]) {
      console.log("   ✅ @neondatabase/neon-js package installed");
    } else {
      errors.push("@neondatabase/neon-js not found in package.json");
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));

  const passed = errors.length === 0;

  if (passed) {
    console.log("✅ Neon JS SDK setup validation PASSED\n");
  } else {
    console.log("❌ Neon JS SDK setup validation FAILED\n");
  }

  if (errors.length > 0) {
    console.log("Errors:");
    errors.forEach((e) => console.log(`   ❌ ${e}`));
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach((w) => console.log(`   ⚠️  ${w}`));
    console.log("");
  }

  if (errors.length > 0) {
    console.log("💡 Troubleshooting:");
    console.log("   • See guides/troubleshooting.md for common issues");
    console.log("   • Verify URLs in the Neon dashboard");
    console.log("   • Ensure Auth and Data API are enabled for your project");
  }

  return { passed, errors, warnings };
}

// Run validation
validateSetup().then((result) => {
  process.exit(result.passed ? 0 : 1);
});
