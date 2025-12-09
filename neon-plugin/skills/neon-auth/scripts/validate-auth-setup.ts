/**
 * Validate Neon Auth Setup Script
 *
 * Verifies that Neon Auth is properly configured in your project.
 * Run with: npx ts-node validate-auth-setup.ts
 *
 * This script will:
 * 1. Check environment variables are set
 * 2. Verify auth URL format
 * 3. Test auth endpoint connectivity
 * 4. Check for required files
 */

import * as fs from "fs";
import * as path from "path";

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

async function validateAuthSetup(): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const cwd = process.cwd();

  console.log("🔍 Validating Neon Auth setup...\n");

  // 1. Check environment variables
  console.log("📋 Checking environment variables...");

  const envFiles = [".env.local", ".env"];
  let envFound = false;
  let authUrl: string | undefined;

  for (const envFile of envFiles) {
    const envPath = path.join(cwd, envFile);
    if (fs.existsSync(envPath)) {
      envFound = true;
      const content = fs.readFileSync(envPath, "utf-8");

      // Check for auth URL
      const baseUrlMatch = content.match(
        /NEON_AUTH_BASE_URL=(.+)/
      );
      const publicUrlMatch = content.match(
        /NEXT_PUBLIC_NEON_AUTH_URL=(.+)/
      );

      if (baseUrlMatch) {
        authUrl = baseUrlMatch[1].trim();
        console.log(`   ✅ NEON_AUTH_BASE_URL found in ${envFile}`);
      } else {
        errors.push(`NEON_AUTH_BASE_URL not found in ${envFile}`);
      }

      if (publicUrlMatch) {
        console.log(`   ✅ NEXT_PUBLIC_NEON_AUTH_URL found in ${envFile}`);
      } else {
        warnings.push(
          `NEXT_PUBLIC_NEON_AUTH_URL not found - client-side auth may not work`
        );
      }

      break;
    }
  }

  if (!envFound) {
    errors.push("No .env.local or .env file found");
  }

  // 2. Validate auth URL format
  console.log("\n📋 Validating auth URL format...");

  if (authUrl) {
    const urlPattern = /^https:\/\/ep-[a-z0-9-]+\.neonauth\.[a-z0-9-]+\.aws\.neon\.build\/[^/]+\/auth$/;
    if (urlPattern.test(authUrl)) {
      console.log("   ✅ Auth URL format is valid");
    } else if (authUrl.includes("neonauth") && authUrl.includes("/auth")) {
      console.log("   ✅ Auth URL appears valid (non-standard format)");
    } else {
      warnings.push(
        `Auth URL format may be incorrect. Expected: https://ep-xxx.neonauth.*.aws.neon.build/dbname/auth`
      );
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
        warnings.push(
          `Auth endpoint returned status ${response.status} - may be misconfigured`
        );
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

  // 4. Check for required files
  console.log("\n📋 Checking project structure...");

  const apiRoutePath = path.join(cwd, "app/api/auth/[...path]/route.ts");
  const apiRouteAltPath = path.join(cwd, "app/api/auth/[...path]/route.js");

  if (fs.existsSync(apiRoutePath) || fs.existsSync(apiRouteAltPath)) {
    console.log("   ✅ API route handler found");
  } else {
    errors.push(
      "API route handler not found at app/api/auth/[...path]/route.ts"
    );
  }

  // Check for auth client
  const clientPaths = [
    "lib/auth/client.ts",
    "lib/auth/client.js",
    "src/lib/auth/client.ts",
    "src/lib/auth/client.js",
  ];

  const clientFound = clientPaths.some((p) =>
    fs.existsSync(path.join(cwd, p))
  );

  if (clientFound) {
    console.log("   ✅ Auth client file found");
  } else {
    warnings.push(
      "Auth client file not found at lib/auth/client.ts - may be in different location"
    );
  }

  // Check for package installation
  const packageJsonPath = path.join(cwd, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (deps["@neondatabase/auth"]) {
      console.log("   ✅ @neondatabase/auth package installed");
    } else if (deps["@neondatabase/neon-js"]) {
      console.log("   ✅ @neondatabase/neon-js package installed (includes auth)");
    } else {
      errors.push(
        "Neither @neondatabase/auth nor @neondatabase/neon-js found in package.json"
      );
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));

  const passed = errors.length === 0;

  if (passed) {
    console.log("✅ Neon Auth setup validation PASSED\n");
  } else {
    console.log("❌ Neon Auth setup validation FAILED\n");
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
    console.log("   • Verify your Neon Auth URL in the Neon dashboard");
    console.log("   • Ensure all files are in the correct locations");
  }

  return { passed, errors, warnings };
}

// Run validation
validateAuthSetup().then((result) => {
  process.exit(result.passed ? 0 : 1);
});
