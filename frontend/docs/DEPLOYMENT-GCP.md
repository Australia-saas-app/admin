# Deploy System DB Frontend on Google Cloud Platform

This guide deploys the **web** app as a Cloud Run service:

| Service         | App        | Default port | Example URL                  |
| --------------- | ---------- | ------------ | ---------------------------- |
| `system-db-web` | `apps/web` | 3000         | `https://www.yourdomain.com` |

The **admin** console is a **separate repository** and is not built from this monorepo. Point `NEXT_PUBLIC_ADMIN_URL` at wherever you host admin (e.g. `https://admin.yourdomain.com`).

Images are stored in **Artifact Registry** and deployed with **Cloud Build**.

---

## Architecture

```text
                    ┌─────────────────────┐
                    │   Cloud Build       │
                    │  (cloudbuild.yaml)  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
   Artifact Registry                   Artifact Registry
   .../web:latest                      .../admin:latest
              │                                 │
              ▼                                 ▼
      Cloud Run: system-db-web          Cloud Run: system-db-admin
      (public site + dashboards)        (admin console)
              │                                 │
              └────────────┬────────────────────┘
                           ▼
                  Backend API (external)
                  NEXT_PUBLIC_BACKEND_URL
```

**Health checks**

- Web: `GET /api/health`
- Admin: `GET /api/health`

---

## Prerequisites

1. A [Google Cloud project](https://console.cloud.google.com/) with billing enabled
2. [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed locally
3. Permission to enable APIs, create Artifact Registry repos, and deploy Cloud Run
4. Your backend API URL (e.g. `https://api.yourdomain.com`)
5. Planned public URLs for web and admin (used at **build time** for `NEXT_PUBLIC_*` variables)

> **Important:** `NEXT_PUBLIC_*` variables are embedded during `next build`. If you change production URLs or the API URL, you must **rebuild and redeploy** the images.

---

## Step 1 — Install and authenticate `gcloud`

```bash
gcloud auth login
gcloud auth application-default login   # optional, for local tooling
```

Set your project (replace `YOUR_PROJECT_ID`):

```bash
gcloud config set project YOUR_PROJECT_ID
```

---

## Step 2 — One-time GCP setup

From the repository root:

**Linux / macOS**

```bash
chmod +x scripts/gcp-setup.sh
./scripts/gcp-setup.sh YOUR_PROJECT_ID us-central1
```

**Windows (PowerShell)** — run the same commands manually:

```powershell
$PROJECT_ID = "YOUR_PROJECT_ID"
$REGION = "us-central1"
$REPOSITORY = "system-db-frontend"

gcloud config set project $PROJECT_ID

gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

gcloud artifacts repositories create $REPOSITORY `
  --repository-format=docker `
  --location=$REGION `
  --description="System DB frontend Docker images"
```

Grant Cloud Build permission to deploy (replace `PROJECT_NUMBER` from `gcloud projects describe YOUR_PROJECT_ID --format=value(projectNumber)`):

```powershell
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" --role="roles/artifactregistry.writer"
```

---

## Step 3 — Choose production URLs

Decide these values before building:

| Variable                  | Example                        | Used by                                    |
| ------------------------- | ------------------------------ | ------------------------------------------ |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.yourdomain.com`   | Both apps — API calls                      |
| `NEXT_PUBLIC_SITE_URL`    | `https://www.yourdomain.com`   | Web metadata, admin → web redirects        |
| `NEXT_PUBLIC_ADMIN_URL`   | `https://admin.yourdomain.com` | Web → admin redirects, admin login invites |

Copy env templates for local reference:

```bash
cp .env.example apps/web/.env.production
cp .env.example apps/admin/.env.production
```

Fill in the production values in both files (they must match what you pass to Cloud Build).

---

## Step 4 — Deploy with Cloud Build

From the repository root:

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_REGION=us-central1,\
_BACKEND_URL=https://api.yourdomain.com,\
_SITE_URL=https://www.yourdomain.com,\
_ADMIN_URL=https://admin.yourdomain.com,\
_APP_NAME="System DB"
```

This will:

1. Build the **web** Docker image with production `NEXT_PUBLIC_*` args
2. Push to `us-central1-docker.pkg.dev/YOUR_PROJECT_ID/system-db-frontend/web`
3. Deploy **Cloud Run** service `system-db-web`
4. Repeat for the **admin** app → `system-db-admin`

First deploy typically takes **10–20 minutes**.

---

## Step 5 — Verify Cloud Run services

List services:

```bash
gcloud run services list --region=us-central1
```

Get default URLs (assigned by Google):

```bash
gcloud run services describe system-db-web --region=us-central1 --format='value(status.url)'
gcloud run services describe system-db-admin --region=us-central1 --format='value(status.url)'
```

Health checks:

```bash
curl -fsS "$(gcloud run services describe system-db-web --region=us-central1 --format='value(status.url)')/api/health"
curl -fsS "$(gcloud run services describe system-db-admin --region=us-central1 --format='value(status.url)')/api/health"
```

Expected response:

```json
{ "status": "ok", "service": "system-db-web", "timestamp": "..." }
```

Open the web URL in a browser and confirm the home page loads. Open the admin URL and sign in at `/account/admin/login`.

---

## Step 6 — Map custom domains (recommended)

For each Cloud Run service:

### Web (`www.yourdomain.com`)

```bash
gcloud run domain-mappings create \
  --service=system-db-web \
  --domain=www.yourdomain.com \
  --region=us-central1
```

### Admin (`admin.yourdomain.com`)

```bash
gcloud run domain-mappings create \
  --service=system-db-admin \
  --domain=admin.yourdomain.com \
  --region=us-central1
```

Follow the CLI output to add **DNS records** at your registrar (usually `CNAME` or `A` records for Cloud Run).

After DNS propagates, **rebuild** with the final HTTPS URLs if you first deployed with temporary `*.run.app` URLs:

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_BACKEND_URL=https://api.yourdomain.com,_SITE_URL=https://www.yourdomain.com,_ADMIN_URL=https://admin.yourdomain.com
```

---

## Step 7 — CI/CD (optional)

### Option A — Cloud Build trigger on `main`

1. Open [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. **Create trigger** → connect your GitHub / Cloud Source repo
3. Event: push to branch `main`
4. Configuration: `cloudbuild.yaml`
5. Substitution variables:

   | Name           | Value                          |
   | -------------- | ------------------------------ |
   | `_BACKEND_URL` | `https://api.yourdomain.com`   |
   | `_SITE_URL`    | `https://www.yourdomain.com`   |
   | `_ADMIN_URL`   | `https://admin.yourdomain.com` |

Every push to `main` rebuilds and redeploys both services.

### Option B — Manual redeploy

Re-run the `gcloud builds submit` command from Step 4 whenever you need a new release.

---

## Local production test (before GCP)

Test both containers locally:

```bash
cp .env.example .env.production
# Edit .env.production with your values

docker compose -f docker-compose.prod.yml up --build
```

- Web: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3001](http://localhost:3001)

Or build images individually:

```bash
# Web
docker build -t system-db-web \
  --build-arg NEXT_PUBLIC_BACKEND_URL=http://localhost:3006 \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  --build-arg NEXT_PUBLIC_ADMIN_URL=http://localhost:3001 \
  .

docker run --rm -p 3000:3000 system-db-web

# Admin
docker build -t system-db-admin \
  --build-arg APP_DIR=admin \
  --build-arg FILTER_PACKAGE=system-db-admin \
  --build-arg PORT=3001 \
  --build-arg NEXT_PUBLIC_BACKEND_URL=http://localhost:3006 \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  --build-arg NEXT_PUBLIC_ADMIN_URL=http://localhost:3001 \
  .

docker run --rm -p 3001:3001 system-db-admin
```

---

## Environment variables reference

### Build-time (`NEXT_PUBLIC_*` — baked into the bundle)

| Variable                  | Required         | Description                         |
| ------------------------- | ---------------- | ----------------------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | Yes (production) | Backend REST API base URL           |
| `NEXT_PUBLIC_SITE_URL`    | Yes              | Public web app URL                  |
| `NEXT_PUBLIC_ADMIN_URL`   | Yes              | Admin app URL                       |
| `NEXT_PUBLIC_APP_NAME`    | No               | Display name (default: `System DB`) |
| `NEXT_PUBLIC_APP_ENV`     | No               | `production` in Cloud Build         |
| `NEXT_PUBLIC_SOCKET_URL`  | No               | WebSocket server for live chat      |

Pass these as Docker `build-arg` values (see `cloudbuild.yaml`).

### Runtime (Cloud Run service env)

| Variable   | Default         | Description                           |
| ---------- | --------------- | ------------------------------------- |
| `NODE_ENV` | `production`    | Set by Cloud Run deploy               |
| `PORT`     | `3000` / `3001` | Set by container / Cloud Run `--port` |

---

## Auth cookies across web + admin

Web and admin run on **different origins** in production (e.g. `www.*` vs `admin.*`). For shared login sessions:

1. Backend should set `accessToken` cookie with `Domain=.yourdomain.com` and `Secure; SameSite=Lax`
2. Both Cloud Run services must be served over HTTPS on subdomains of the same registrable domain
3. CORS on the API must allow both origins

If cookies are origin-scoped only, users sign in separately on web and admin.

---

## Troubleshooting

| Issue                                | What to check                                                                                                              |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Build fails at `typecheck`           | Run `pnpm typecheck` locally; fix errors before submitting                                                                 |
| `403` pushing to Artifact Registry   | Re-run `scripts/gcp-setup.sh` IAM bindings                                                                                 |
| Cloud Run deploy `Permission denied` | Cloud Build SA needs `roles/run.admin` + `roles/iam.serviceAccountUser`                                                    |
| Admin links go to `localhost`        | Rebuild with correct `_ADMIN_URL` / `_SITE_URL` substitutions                                                              |
| API calls fail in browser            | `NEXT_PUBLIC_BACKEND_URL` must be reachable from the user's browser; configure API CORS                                    |
| Old `/admin` on web broken           | Web redirects `/admin/*` to `NEXT_PUBLIC_ADMIN_URL` — rebuild web after setting URL                                        |
| Health check fails                   | Ensure `/api/health` returns 200; check Cloud Run logs: `gcloud run services logs read system-db-web --region=us-central1` |

View logs:

```bash
gcloud run services logs read system-db-web --region=us-central1 --limit=50
gcloud run services logs read system-db-admin --region=us-central1 --limit=50
```

---

## Cost notes

- Cloud Run bills per request and CPU/memory while handling traffic
- `--min-instances=0` (default) scales to zero when idle
- Artifact Registry stores image layers (small ongoing storage cost)
- Cloud Build charges per build minute (`E2_HIGHCPU_8` in `cloudbuild.yaml`)

Adjust `--memory`, `--cpu`, and `--max-instances` in `cloudbuild.yaml` for your traffic profile.

---

## Quick reference

```bash
# One-time setup
./scripts/gcp-setup.sh YOUR_PROJECT_ID us-central1

# Deploy both apps
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_BACKEND_URL=https://api.example.com,_SITE_URL=https://www.example.com,_ADMIN_URL=https://admin.example.com

# Service URLs
gcloud run services describe system-db-web --region=us-central1 --format='value(status.url)'
gcloud run services describe system-db-admin --region=us-central1 --format='value(status.url)'
```
