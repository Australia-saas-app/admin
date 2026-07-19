#!/usr/bin/env bash
# One-time GCP project setup for System DB frontend (web + admin on Cloud Run).
# Usage: ./scripts/gcp-setup.sh YOUR_GCP_PROJECT_ID [REGION]

set -euo pipefail

PROJECT_ID="${1:?Usage: $0 <gcp-project-id> [region]}"
REGION="${2:-us-central1}"
REPOSITORY="system-db-frontend"

echo "==> Configuring gcloud for project: ${PROJECT_ID} (${REGION})"
gcloud config set project "${PROJECT_ID}"

echo "==> Enabling required APIs"
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com

echo "==> Creating Artifact Registry repository (if missing)"
if ! gcloud artifacts repositories describe "${REPOSITORY}" --location="${REGION}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${REPOSITORY}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="System DB frontend Docker images"
fi

echo "==> Granting Cloud Build permission to deploy Cloud Run"
PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/run.admin" \
  --quiet >/dev/null

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --quiet >/dev/null

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/artifactregistry.writer" \
  --quiet >/dev/null

echo ""
echo "Setup complete."
echo ""
echo "Next: deploy with Cloud Build"
echo "  gcloud builds submit --config=cloudbuild.yaml \\"
echo "    --substitutions=_BACKEND_URL=https://api.YOUR_DOMAIN,_SITE_URL=https://www.YOUR_DOMAIN,_ADMIN_URL=https://admin.YOUR_DOMAIN"
echo ""
echo "See docs/DEPLOYMENT-GCP.md for the full walkthrough."
