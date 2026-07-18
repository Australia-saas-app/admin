# Backend wiring checklist

The frontend is already shaped to talk to a REST API via `NEXT_PUBLIC_BACKEND_URL`.

## Base URL & versioning

All relative API paths resolve against
`{NEXT_PUBLIC_BACKEND_URL}/api/{NEXT_PUBLIC_API_VERSION}` (default `…/api/v1`)
via `envConfig.apiBaseURL`. This applies to `axiosInstance`, `serverFetch`,
and `PublicServerFetch`. Set `NEXT_PUBLIC_API_VERSION=""` if the backend does
not use a version prefix.

## Required env

| Variable                  | Used by                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_BACKEND_URL` | `shared/lib/axiosInstance`, `PublicServerFetch`, chat client |
| `NEXT_PUBLIC_API_VERSION` | API version prefix (default `v1`)                            |
| `NEXT_PUBLIC_SITE_URL`    | Web metadata + cross-app links                               |
| `NEXT_PUBLIC_ADMIN_URL`   | Admin redirects from web                                     |
| `COOKIE_SECURE`           | `false` on HTTP VMs; `true` behind HTTPS                     |

## Auth

1. Prefer backend JWT in httpOnly `accessToken` cookie (`shared/server/AuthService`).
2. Demo accounts and local registration remain fallbacks when the API is unreachable.
3. For shared web + admin sessions on subdomains, set cookie `Domain=.yourdomain.com` on the API.

Expected login response shape:

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "refreshToken": "<refresh-jwt, optional>",
    "user": { "id": "...", "email": "...", "role": "USER|AFFILIATE|SELLER|ADMIN|SUPER_ADMIN" }
  }
}
```

When `refreshToken` is returned it is stored as an httpOnly cookie and used by
the automatic 401-retry flow (`POST /auth/refresh-token`). Refresh-token
rotation is supported: return a new `data.refreshToken` from the refresh
endpoint and it will replace the stored one.

## Team page

- Service: `GET {BACKEND}/platform-service/team?page=1&limit=48`
- File: `shared/server/TeamService/index.ts`
- Accepts `data[]`, `data.items`, `data.results`, or a top-level array
- Falls back to `modules/our-teams/data/mock-team.ts` when empty / offline

## Incremental migration

Replace stores under `shared/lib/*-store.ts` with React Query + axios calls to matching API routes. Keep response mappers in `shared/server/*` so UI components stay stable.
