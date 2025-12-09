/**
 * Neon Auth Client Configuration
 *
 * Place this file at: lib/auth/client.ts (or your preferred location)
 *
 * Usage in components:
 *   import { authClient } from "@/lib/auth/client";
 *   const session = authClient.useSession();
 */
import { createAuthClient } from '@neondatabase/auth/next';

/**
 * Auth client for use in client components.
 * Automatically uses environment variables:
 * - NEXT_PUBLIC_NEON_AUTH_URL
 */
export const authClient = createAuthClient();

/**
 * Example usage in a component:
 *
 * "use client";
 * import { authClient } from "@/lib/auth/client";
 *
 * function AuthStatus() {
 *   const session = authClient.useSession();
 *
 *   if (session.isPending) return <div>Loading...</div>;
 *   if (!session.data) return <button onClick={() => authClient.signIn.email({ email, password })}>Sign In</button>;
 *
 *   return (
 *     <div>
 *       <p>Hello, {session.data.user.name}</p>
 *       <button onClick={() => authClient.signOut()}>Sign Out</button>
 *     </div>
 *   );
 * }
 */
