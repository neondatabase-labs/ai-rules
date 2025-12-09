/**
 * Neon Auth API Route Handler for Next.js
 *
 * Place this file at: app/api/auth/[...path]/route.ts
 *
 * This creates all necessary authentication endpoints:
 * - /api/auth/sign-in
 * - /api/auth/sign-up
 * - /api/auth/sign-out
 * - /api/auth/session
 * - /api/auth/callback/* (for OAuth)
 */

import { authApiHandler } from "@neondatabase/auth/next";

export const { GET, POST } = authApiHandler();
