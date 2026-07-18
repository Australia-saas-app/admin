# Coding Guidelines

Conventions for working in this monorepo. The goal is a codebase that reads
the same regardless of who wrote it.

## Project layout

| Location     | Contents                                                              |
| ------------ | --------------------------------------------------------------------- |
| `apps/web`   | Public site + user dashboards (Next.js App Router, port 3000)         |
| `apps/admin` | Admin console (Next.js App Router, port 3001)                         |
| `modules/`   | Feature modules (domain-driven): components, hooks, data per feature  |
| `shared/`    | Cross-cutting code: UI kit, lib, hooks, utils, server actions, config |
| `tests/`     | Root-level unit/component tests (Vitest + Testing Library)            |

Rules of thumb:

- **Pages stay thin.** An `app/**/page.tsx` should render a module component and
  do little else. All real logic lives under `modules/` or `shared/`.
- **Modules must not import from other modules** except through `shared/`.
  This keeps modules independently extractable (micro-frontend ready).
- **All environment access goes through `shared/config`** (`envConfig`). Never
  read `process.env` in feature code.

## Imports

Use the `@/src/*` aliases (defined in each app's `tsconfig.json` and mirrored
in `vitest.config.ts`):

```ts
import { can } from "@/src/lib/rbac"; // shared/lib
import { Button } from "@/src/components/ui/button"; // shared/components
import Hero from "@/src/modules/home/components/hero"; // modules
```

## Naming

- **Components / component files**: `PascalCase` (`AdminDataTable.tsx`)
- **Hooks**: `camelCase` with `use` prefix, `*.hook.ts` (`permission.hook.ts`)
- **Utilities / lib**: `kebab-case` (`api-error.ts`, `feature-flags.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE` for values, `kebab-case` filenames
- **Types/interfaces**: `PascalCase`; prefix interfaces only where established (`IUser`)

## API & data

- Server-side requests go through `axiosInstance` (authenticated) or
  `serverFetch`/`PublicServerFetch`. All of them resolve relative paths
  against `envConfig.apiBaseURL` (`<backend>/api/<version>`).
- Errors are normalized to `ApiError` (`shared/lib/api-error.ts`). In UI code,
  render `parseApiError(error)` — never raw axios internals.
- Server state uses React Query hooks; global client state uses the context
  providers in `shared/context`. Do not add new state libraries.
- Forms use React Hook Form + Zod. Server actions must re-validate input
  with Zod (`safeParse`) — never trust the client payload.

## Security

- Never render untrusted HTML directly. Use `sanitizeHtml` from
  `shared/lib/sanitize-html.ts` before any `dangerouslySetInnerHTML`.
- Tokens live in httpOnly cookies set by server actions; never store them in
  localStorage or expose them to client JS.
- Gate UI actions with RBAC: `usePermission()` / `<PermissionGuard>` backed by
  `shared/lib/rbac.ts`. Page access is enforced in each app's `proxy.ts`.

## Observability

- Use `logger` (`shared/lib/logger.ts`) instead of `console.*`.
- Report caught-but-fatal errors with `reportError` (`shared/lib/error-reporter.ts`).
- Record notable user/admin actions with `activityLog.record(...)`
  (`shared/lib/activity-log.ts`) — these feed the admin audit trail.

## Styling

- Tailwind CSS v4 with the design tokens defined in `globals.css`
  (`bg-background`, `text-foreground`, `text-primary`, `border-border`, …).
  Do not hardcode hex colors or `gray-*`/`blue-*` classes in new code.
- Prefer natural, flat colors; avoid decorative gradients.
- Reuse the UI kit in `shared/components/ui` (Button, Modal, EmptyState,
  SkeletonCard, ErrorBoundary, …) before writing new primitives.

## Testing

- Tests live in `tests/` (or colocated `*.test.ts` in `shared/`/`modules/`)
  and run with `pnpm test` (Vitest, jsdom).
- New shared utilities and RBAC/permission logic must ship with unit tests.
- Component tests use Testing Library — test behavior, not implementation.

## Quality gates

Run before pushing (CI runs the same):

```bash
pnpm lint        # ESLint via turbo
pnpm typecheck   # tsc --noEmit for both apps
pnpm test        # Vitest unit/component tests
pnpm format      # Prettier (also runs on staged files via husky + lint-staged)
```

## Commits

- Small, focused commits; imperative mood ("Add sorting to AdminDataTable").
- A husky pre-commit hook formats staged files with Prettier automatically.
