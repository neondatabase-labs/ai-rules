# Neon Auth Setup Reference

This is an index file. For framework-specific setup guides, see the links below.

## Framework-Specific Guides

Choose your framework for complete setup instructions:

| Framework | Guide | Lines |
|-----------|-------|-------|
| **Next.js App Router** | [neon-auth-setup-nextjs.md](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md) | ~100 |
| **React SPA (Vite/CRA)** | [neon-auth-setup-react-spa.md](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-react-spa.md) | ~250 |
| **Node.js Backend** | [neon-auth-setup-nodejs.md](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nodejs.md) | ~150 |

## For AI Agents

To get full content without summarization, fetch the framework-specific file directly:

```bash
# Example for Next.js
curl -s -o /tmp/neon-auth-setup.md https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-setup-nextjs.md
```

Then read the downloaded file for complete documentation.

## Quick Reference

### Package Selection

| Need | Package | Bundle Size |
|------|---------|-------------|
| Auth only | `@neondatabase/auth` | ~50KB |
| Auth + Database queries | `@neondatabase/neon-js` | ~150KB |

### Environment Variables

| Framework | Variable Format |
|-----------|-----------------|
| Next.js | `NEON_AUTH_BASE_URL` + `NEXT_PUBLIC_NEON_AUTH_URL` |
| Vite | `VITE_NEON_AUTH_URL` |
| CRA | `REACT_APP_NEON_AUTH_URL` |
| Node.js | `NEON_AUTH_URL` |

---

**Note**: This file was restructured on 2025-12-16. If you have direct links to this file, they will continue to work but now redirect to framework-specific guides.

**Reference Version**: 1.1.0
**Last Updated**: 2025-12-16
