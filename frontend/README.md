# System DB — Frontend

Frontend application for **System DB**, a multi-role platform for users, affiliates, businesses, and administrators. This repository contains the UI and client-side logic only. When a backend API is connected, data flows through the existing service layer; without it, demo accounts and local persistence keep flows usable for development and review.

Built with **Next.js 16** (App Router), **React 19**, and **TypeScript**, organized as a **pnpm + Turborepo** monorepo with the **web** app in this repo:

| App        | Package     | Port (dev) | Purpose                                                   |
| ---------- | ----------- | ---------- | --------------------------------------------------------- |
| `apps/web` | `system-db` | 3000       | Public site, auth, user / affiliate / business dashboards |

The **admin** console is a **separate repository** (local sibling `../admin`, port **3001**). Shared UI used by web still lives in `modules/` and `shared/` here (including verification helpers used by signup flows).

---

## Features

**Public site**

- Catalog and marketing pages: marketplace, careers, courses, real estate, transport, visa & travel, technical services, associates, blogs, notices, branches, gallery, and related info pages
- Apply and contact flows from public listings

**Authentication & onboarding**

- Role-based login and registration (user, affiliate, business, admin)
- Document verification step after signup
- Pending-verification screen until an admin approves the account
- Password reset flows

**Dashboards**

| Role      | Base path                   | Highlights                                                                                 |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| User      | `/user/*`                   | Wallet, orders, applications, marketplace, technical projects, messages, profile, settings |
| Affiliate | `/affiliate/*`              | Referrals, earnings, promotions, wallet, technical projects, messages                      |
| Business  | `/business/*`               | Services, clients, transactions, wallet, courses, technical projects, messages             |
| Admin     | `/admin/*` on **admin app** | Users, verifications, applications, transactions, platform management                      |

**Other**

- Demo accounts with seeded data vs. empty states for newly registered users
- Role-based access control in middleware (per app)
- Cross-app URL helpers (`shared/constants/app-urls.ts`) for web ↔ admin links in production
- Internationalization (English, Spanish, Hindi)
- Client stores shaped for later API integration (`wallet-store`, `application-store`, `messages-store`, `verification-store`, and others)

---

## Tech stack

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Framework | Next.js 16 (App Router)                     |
| UI        | React 19, Tailwind CSS v4, Radix UI, Lucide |
| Monorepo  | pnpm workspaces, Turborepo                  |
| Data      | TanStack React Query, Axios                 |
| Forms     | React Hook Form, Zod                        |
| Language  | TypeScript 5                                |
| Testing   | Vitest, Testing Library                     |

---

## Prerequisites

**Local (recommended for day-to-day UI work):**

- Node.js 18+ and [pnpm 9](https://pnpm.io/) (`corepack enable && corepack prepare pnpm@9.0.0 --activate`)

**Docker (optional, for production-like runs):**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2)

---

## Getting started

### Local development (fast)

```bash
pnpm install

# Web — http://localhost:3000
pnpm dev

# Admin (separate repo) — http://localhost:3001
# cd ../admin && pnpm install && pnpm dev
```

Copy env if needed:

```bash
# Optional: root .env is for Docker Compose
cp .env.example .env
```

| App   | URL                   | Login (demo)                                               |
| ----- | --------------------- | ---------------------------------------------------------- |
| Web   | http://localhost:3000 | `business@demo.com` / `demo123456` → `/business/dashboard` |
| Admin | http://localhost:3001 | `admin@demo.com` / `demo123456` (separate `admin` repo)    |

### Docker (slower rebuilds)

```bash
cp .env.example .env
# Edit NEXT_PUBLIC_BACKEND_URL if your API is not on the host at :3006
pnpm docker:dev          # or: docker compose up --build
```

| App   | URL                   |
| ----- | --------------------- |
| Web   | http://localhost:3000 |
| Admin | http://localhost:3001 |

### Useful Docker commands

```bash
pnpm docker:start   # detached
pnpm docker:logs    # follow logs
pnpm docker:stop    # stop & remove containers
```

| Variable                     | Description                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_BACKEND_URL`    | Backend API base URL (no trailing slash). Optional for local demo use. |
| `NEXT_PUBLIC_SITE_URL`       | Public web app URL (e.g. `http://localhost:3000`)                      |
| `NEXT_PUBLIC_ADMIN_URL`      | Admin app URL (e.g. `http://localhost:3001`)                           |
| `NEXT_PUBLIC_APP_ENV`        | `development`, `staging`, or `production`                              |
| `NEXT_PUBLIC_SOCKET_URL`     | WebSocket server for live chat (optional)                              |
| `NEXT_PUBLIC_SUPER_ADMIN_ID` | Protected super admin ID (default: `SUPER001`)                         |
| `COOKIE_SECURE`              | Set `false` for HTTP (e.g. VM IP). Use `true` on HTTPS.                |

See `.env.example` for the full list. Do not commit `.env`.

On the web app, `/admin/*` and `/account/admin/login` redirect to the admin app URL (`NEXT_PUBLIC_ADMIN_URL`).

### Build / rebuild images

```bash
docker compose build
docker compose up --build -d
```

Quality checks on the host after `pnpm install`:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

---

## Demo accounts

When no backend is available, these accounts work for local review:

| Role      | Email                | Password     | Dashboard                      |
| --------- | -------------------- | ------------ | ------------------------------ |
| User      | `user@demo.com`      | `demo123456` | `/user/dashboard` (web)        |
| Affiliate | `affiliate@demo.com` | `demo123456` | `/affiliate/dashboard` (web)   |
| Business  | `business@demo.com`  | `demo123456` | `/business/dashboard` (web)    |
| Admin     | `admin@demo.com`     | `demo123456` | `/admin/dashboard` (admin app) |

**Login URLs**

| App                         | URL                                          |
| --------------------------- | -------------------------------------------- |
| User / affiliate / business | `http://localhost:3000/account/{type}/login` |
| Admin                       | `http://localhost:3001/account/admin/login`  |

Web and admin login pages are separate — there are no cross-links between them.

**Registered users (no backend)**

1. Sign up at `/account/{type}/registration`
2. Complete document verification
3. Land on `/account/{type}/pending-verification`
4. Approve the account at `http://localhost:3001/admin/verifications` (admin app)
5. Dashboard access is unlocked

Demo accounts show seeded sample data. New registrations see empty dashboards with per-user `localStorage` scoping.

Legacy URLs under `/dashboard/{role}/*` redirect to `/{role}/*`.

---

## Routes

### Web app (`apps/web` — port 3000)

**Public**

| Path                    | Description        |
| ----------------------- | ------------------ |
| `/`                     | Home               |
| `/marketplace`          | Marketplace        |
| `/careers`              | Job listings       |
| `/courses`              | Course catalog     |
| `/real-estate`          | Property listings  |
| `/transport`            | Transport          |
| `/visa`, `/visa-travel` | Visa & travel      |
| `/technical`            | Technical services |
| `/associate`            | Associates         |
| `/blogs`                | Articles           |
| `/notice`               | Notices            |
| `/branch`               | Branches           |
| `/gallery`              | Gallery            |

**Auth**

| Path                                         | Description             |
| -------------------------------------------- | ----------------------- |
| `/account/{user\|affiliate\|business}/login` | Role login              |
| `/account/{type}/registration`               | Sign up                 |
| `/account/{type}/verification`               | Document upload         |
| `/account/{type}/pending-verification`       | Awaiting admin approval |

**Dashboards**

| Path           | Description         |
| -------------- | ------------------- |
| `/user/*`      | User dashboard      |
| `/affiliate/*` | Affiliate dashboard |
| `/business/*`  | Business dashboard  |

**Redirects to admin app**

| Path on web            | Redirects to                                  |
| ---------------------- | --------------------------------------------- |
| `/admin`, `/admin/*`   | `{NEXT_PUBLIC_ADMIN_URL}/admin/...`           |
| `/account/admin/login` | `{NEXT_PUBLIC_ADMIN_URL}/account/admin/login` |

Legacy URLs under `/dashboard/{role}/*` redirect to `/{role}/*`.

### Admin app (`apps/admin` — port 3001)

| Path                   | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `/account/admin/login` | Admin login                                                 |
| `/admin/dashboard`     | Admin home                                                  |
| `/admin/*`             | Users, verifications, content, transactions, settings, etc. |
| `/api/health`          | Health check (for Cloud Run / load balancers)               |

Route constants live in `shared/constants/routes.ts`. Cross-app URLs use `shared/constants/app-urls.ts`.

---

## Project structure

```
frontend/
├── apps/
│   ├── web/                  # Public site + user/affiliate/business dashboards
│   │   └── app/              # Next.js App Router pages
│   └── admin/                # Admin console (separate Next.js app)
│       └── app/
│           ├── admin/        # /admin/* routes
│           └── account/admin/  # Admin login
├── modules/                  # Feature modules by domain (shared by both apps)
│   ├── account/              # Auth and onboarding
│   ├── dashboard/            # Role dashboards
│   ├── admin/                # Admin UI components
│   ├── home/                 # Landing page
│   └── …                     # marketplace, jobs, courses, etc.
├── shared/                   # Cross-cutting logic
│   ├── components/
│   ├── constants/            # routes, app-urls, demo-accounts, …
│   ├── hooks/
│   ├── i18n/
│   ├── lib/                  # Client stores
│   └── server/               # AuthService, local user store
├── services/                 # API client and utilities
├── docs/
│   └── DEPLOYMENT-GCP.md     # GCP Cloud Run deployment guide
├── scripts/
│   └── gcp-setup.sh          # One-time GCP project setup
├── Dockerfile                # Parameterized image (web or admin via build args)
├── cloudbuild.yaml           # GCP Cloud Build → Cloud Run
└── docker-compose.prod.yml   # Local production stack (web + admin)
```

- **Web pages:** `apps/web/app/`
- **Admin pages:** `apps/admin/app/`
- **Shared UI/logic:** `modules/<domain>/` — import via `@/src/modules/*` and `@/src/shared/*`

New features should follow `modules/<domain>/` and wire pages in the appropriate app.

---

## Frontend-only behavior

This codebase is intended to be reviewed and integrated without a live API.

| Area                                     | Behavior without backend                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| Auth                                     | Local demo login; registered users stored in `apps/web/data/registered-users.json` |
| Dashboard data                           | `localStorage` with per-user scoping                                               |
| Admin verifications & applications       | Functional via client stores                                                       |
| Admin content (blogs, gallery, branches) | Read-only mock tables                                                              |
| Chat                                     | Works offline; connects when `NEXT_PUBLIC_SOCKET_URL` is set                       |
| `/ecommerce`, `/airline`                 | Standalone module demos, not linked from main navigation                           |

When `NEXT_PUBLIC_BACKEND_URL` is set, auth and API calls use the backend. Client stores can be replaced with REST calls incrementally.

---

## Suggested manual checks

Before a demo or handoff, walk through:

- [ ] Public catalog pages load on web (`:3000`)
- [ ] Demo login for user, affiliate, business on web; admin on admin app (`:3001`)
- [ ] New registration → pending verification → admin approval on admin app → dashboard access
- [ ] Apply from a public listing → User → Applications; admin can update status
- [ ] Wallet: add/remove payment methods, request withdrawal
- [ ] Settings: change password, 2FA toggle, account deletion
- [ ] Cross-role routes redirect to the correct dashboard
- [ ] Web `/admin/*` redirects to admin app
- [ ] `GET /api/health` returns 200 on both apps
- [ ] `pnpm typecheck` and `pnpm lint` pass

---

## Scripts

| Command                                      | Description                                                     |
| -------------------------------------------- | --------------------------------------------------------------- |
| `docker compose up --build`                  | Build and run web (`:3000`) + admin (`:3001`)                   |
| `pnpm dev`                                   | Alias for `docker compose up --build`                           |
| `pnpm start`                                 | Run stack detached (`docker compose up --build -d`)             |
| `pnpm stop`                                  | Stop containers (`docker compose down`)                         |
| `pnpm logs`                                  | Follow container logs                                           |
| `pnpm docker:build`                          | Rebuild images only                                             |
| `pnpm docker:prod`                           | Same stack via `docker-compose.prod.yml`                        |
| `pnpm build` / `lint` / `typecheck` / `test` | CI / Node container only (requires install inside Docker or CI) |
| `pnpm gcp:setup`                             | One-time GCP project setup (`scripts/gcp-setup.sh`)             |
| `pnpm gcp:deploy`                            | Submit `cloudbuild.yaml` to Google Cloud Build                  |

---

## Development notes

**Routes**

```ts
import { ROUTES } from "@/src/constants/routes";
```

**API errors**

```ts
import { parseApiError } from "@/src/lib/api-error";
import { toast } from "sonner";

toast.error(parseApiError(error, "Something went wrong"));
```

**Authenticated server fetch**

```ts
import { serverFetchJson } from "@/src/lib/serverFetch";
// Relative paths resolve against <NEXT_PUBLIC_BACKEND_URL>/api/<NEXT_PUBLIC_API_VERSION>
const data = await serverFetchJson("/resource");
```

**Testing**

```bash
pnpm test          # unit/component tests (Vitest + Testing Library)
pnpm test:watch    # watch mode
pnpm test:e2e      # Playwright smoke across Chromium/Firefox/WebKit
```

Unit tests live in `tests/`; E2E smoke specs live in `e2e/`. Lighthouse CI runs on PRs via `.github/workflows/lighthouse.yml`. See [docs/CODING-GUIDELINES.md](docs/CODING-GUIDELINES.md).

Public page shells and modals are in `modules/shared/components/public/`.

**Cross-app URLs (web ↔ admin)**

```ts
import { adminAppPath, webAppPath } from "@/src/constants/app-urls";

// On web: link to admin console
const adminDashboard = adminAppPath("/admin/dashboard");

// On admin: link back to public site (if needed)
const userLogin = webAppPath("/account/user/login");
```

Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ADMIN_URL` in production so these resolve correctly.

---

## Deployment

### Google Cloud Platform (recommended)

The project ships ready for **Cloud Run** with two services (web + admin).

**Full guides:**

- Cloud Run (managed): [docs/DEPLOYMENT-GCP.md](docs/DEPLOYMENT-GCP.md)
- **Compute Engine VM:** [docs/DEPLOYMENT-GCP-VM.md](docs/DEPLOYMENT-GCP-VM.md)
- **Backend wiring:** [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md)

Quick start:

```bash
# 1. One-time GCP setup
./scripts/gcp-setup.sh YOUR_GCP_PROJECT_ID us-central1

# 2. Build & deploy both apps
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_BACKEND_URL=https://api.yourdomain.com,_SITE_URL=https://www.yourdomain.com,_ADMIN_URL=https://admin.yourdomain.com
```

Local production test:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Health endpoints: `GET /api/health` on web (`:3000`) and admin (`:3001`).

### Node (standalone)

```bash
pnpm build
pnpm --filter system-db start          # web on :3000
pnpm --filter system-db-admin start    # admin on :3001
```

### Cloudflare

```bash
pnpm build:cloudflare
pnpm --filter system-db deploy:cloudflare
```

Security headers are configured in each app's `next.config.ts`. Access tokens are designed for httpOnly cookies when the backend sets them.

For shared auth across `www.*` and `admin.*` subdomains in production, configure the backend cookie `Domain=.yourdomain.com` — see [docs/DEPLOYMENT-GCP.md](docs/DEPLOYMENT-GCP.md#auth-cookies-across-web--admin).

---

## Contributing

1. Branch from `main`
2. Add features under `modules/<feature>/`
3. Use shared route constants and error helpers
4. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before opening a PR
5. Follow [docs/CODING-GUIDELINES.md](docs/CODING-GUIDELINES.md) (a husky pre-commit hook formats staged files automatically)

---

## License

Private — all rights reserved unless otherwise specified by the repository owner.
