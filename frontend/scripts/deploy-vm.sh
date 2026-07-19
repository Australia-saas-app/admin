#!/usr/bin/env bash
# Deploy the web app on the GCP VM (used by GitHub Actions SSH step).
# Admin is a separate repository.
# Usage (from repo root on the VM):
#   bash scripts/deploy-vm.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Deploying from: $ROOT"
echo "==> Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$BRANCH" == "HEAD" ]]; then
    BRANCH="main"
  fi
  echo "==> Fetching origin/${BRANCH}…"
  git fetch --prune origin "$BRANCH"
  git reset --hard "origin/${BRANCH}"
else
  echo "ERROR: $ROOT is not a git repository" >&2
  exit 1
fi

if [[ -f .env.production ]]; then
  echo "==> Loading .env.production"
  set -a
  # shellcheck disable=SC1091
  source ./.env.production
  set +a
else
  echo "WARNING: .env.production missing — using existing shell env / compose defaults"
fi

echo "==> Building and starting containers…"
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Waiting for web health endpoint…"
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "http://127.0.0.1:3000/api/health" >/dev/null 2>&1; then
    echo "==> Health OK (web)"
    break
  fi
  if [[ "$i" -eq 10 ]]; then
    echo "ERROR: web health check failed after retries" >&2
    docker compose -f docker-compose.prod.yml ps || true
    docker compose -f docker-compose.prod.yml logs --tail=80 || true
    exit 1
  fi
  sleep 6
done

docker image prune -f >/dev/null 2>&1 || true
echo "==> Deployment complete at $(date -u +%Y-%m-%dT%H:%M:%SZ)"
