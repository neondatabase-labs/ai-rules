# Neon Auth UI Components Reference

This is an index file. For framework-specific UI setup guides, see the links below.

## Framework-Specific UI Guides

Choose your framework for complete UI provider setup:

| Framework | Guide | Lines |
|-----------|-------|-------|
| **Next.js App Router** | [neon-auth-ui-nextjs.md](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-nextjs.md) | ~200 |
| **React SPA (Vite/CRA)** | [neon-auth-ui-react-spa.md](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-react-spa.md) | ~250 |

## For AI Agents

To get full content without summarization, fetch the framework-specific file directly:

```bash
# Example for Next.js
curl -s -o /tmp/neon-auth-ui.md https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/references/neon-auth-ui-nextjs.md
```

Then read the downloaded file for complete documentation.

## Quick Reference

### Import Paths

| What | `@neondatabase/auth` |
|------|---------------------|
| UI Provider | `@neondatabase/auth/react/ui` |
| Components | `@neondatabase/auth/react/ui` |
| Server utilities | `@neondatabase/auth/react/ui/server` |
| CSS | `@neondatabase/auth/ui/css` |
| Tailwind | `@neondatabase/auth/ui/tailwind` |

### Available Components

| Component | Description |
|-----------|-------------|
| `AuthView` | Full auth pages (sign-in, sign-up, etc.) |
| `UserButton` | Avatar dropdown with settings/logout |
| `SignedIn` / `SignedOut` | Conditional rendering |
| `AccountView` | Account settings pages |

### CSS Import (Choose ONE)

**With Tailwind:**
```css
@import '@neondatabase/auth/ui/tailwind';
```

**Without Tailwind:**
```typescript
import "@neondatabase/auth/ui/css";
```

---

**Note**: This file was restructured on 2025-12-16. If you have direct links to this file, they will continue to work but now redirect to framework-specific guides.

**Reference Version**: 1.1.0
**Last Updated**: 2025-12-16
