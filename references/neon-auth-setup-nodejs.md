# Neon Auth Setup - Node.js Backend

Complete setup instructions for Neon Auth in Node.js backend applications (Express, Fastify, etc.).

---

## 1. Install Package

```bash
npm install @neondatabase/auth
```

## 2. Environment Variables

Create or update `.env`:

```bash
NEON_AUTH_URL=https://ep-xxx.neonauth.c-2.us-east-2.aws.neon.build/dbname/auth
```

**Where to find your Auth URL:**
1. Go to your Neon project dashboard
2. Navigate to the "Auth" tab
3. Copy the Auth URL

**Important:** Add `.env` to `.gitignore` if not already present.

## 3. Auth Client Configuration

```typescript
import { createAuthClient } from "@neondatabase/auth";

const auth = createAuthClient(process.env.NEON_AUTH_URL!);
```

## 4. Auth Methods

### Sign Up

```typescript
const { data, error } = await auth.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe", // Optional
});

if (error) {
  console.error("Sign up failed:", error.message);
}
```

### Sign In

```typescript
// Email/password
const { data, error } = await auth.signIn.email({
  email: "user@example.com",
  password: "securepassword",
});

// Social (Google, GitHub) - generates redirect URL
const { data, error } = await auth.signIn.social({
  provider: "google", // or "github"
  callbackURL: "/dashboard",
});
```

### Sign Out

```typescript
await auth.signOut();
```

### Get Session

```typescript
const session = await auth.getSession();

if (session) {
  console.log("User:", session.user);
  console.log("Session expires:", session.session.expiresAt);
}
```

## 5. Express.js Example

```typescript
import express from "express";
import { createAuthClient } from "@neondatabase/auth";

const app = express();
app.use(express.json());

const auth = createAuthClient(process.env.NEON_AUTH_URL!);

// Sign up endpoint
app.post("/api/signup", async (req, res) => {
  const { email, password, name } = req.body;

  const { data, error } = await auth.signUp.email({ email, password, name });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ user: data.user });
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await auth.signIn.email({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({ session: data });
});

// Get session endpoint
app.get("/api/session", async (req, res) => {
  const session = await auth.getSession();
  res.json({ session });
});

// Logout endpoint
app.post("/api/logout", async (req, res) => {
  await auth.signOut();
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## 6. Error Handling

```typescript
const { data, error } = await auth.signIn.email({ email, password });

if (error) {
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return res.status(401).json({ error: "Invalid email or password" });
    case "EMAIL_NOT_VERIFIED":
      return res.status(401).json({ error: "Please verify your email" });
    case "USER_NOT_FOUND":
      return res.status(404).json({ error: "User not found" });
    case "TOO_MANY_REQUESTS":
      return res.status(429).json({ error: "Too many attempts. Please wait." });
    default:
      return res.status(500).json({ error: "Authentication failed" });
  }
}
```

## 7. Session Data Structure

```typescript
interface Session {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
}
```

---

## Package Selection

For backend-only use cases, `@neondatabase/auth` is recommended as it has a smaller bundle size (~50KB vs ~150KB for `@neondatabase/neon-js`).

Use `@neondatabase/neon-js` only if you also need PostgREST-style database queries from the same package.

---

## Related References

- [Common Mistakes](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-common-mistakes.md) - Import paths, configuration errors
- [Troubleshooting Guide](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-troubleshooting.md) - Error solutions

---

**Reference Version**: 1.1.0
**Last Updated**: 2025-12-16
