#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting Fast Deployment Process..."

# Enable Docker BuildKit & CLI Build for high performance layer caching
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# 1. Force pull latest code from GitHub (overwriting any local changes)
echo "📥 Pulling latest code from GitHub..."
git fetch --all
git reset --hard origin/main

# 2. Clean up dangling images to ensure there is enough disk space
echo "🧹 Cleaning up old Docker dangling images..."
docker image prune -f || true

# 3. Start the new containers with BuildKit parallel cached builds
echo "✅ Building and starting new containers..."
docker compose up -d --build --remove-orphans

# 4. Clean up unused Docker images to free up disk space
echo "🧹 Cleaning up old images..."
docker image prune -f || true

echo "🎉 Deployment completed successfully! Your app is now running the latest code."
