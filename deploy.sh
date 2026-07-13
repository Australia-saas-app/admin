#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting Deployment Process..."

# 1. Force pull latest code from GitHub (overwriting any local changes)
echo "📥 Pulling latest code from GitHub..."
git fetch --all
git reset --hard origin/main

# 2. Build containers without cache to ensure all changes apply
echo "🔨 Building Docker containers..."
docker compose build --no-cache

# 3. Stop running containers to prevent port conflicts or state issues
echo "🛑 Stopping current containers..."
docker compose down

# 4. Start the new containers
echo "✅ Starting new containers..."
docker compose up -d

# 5. Clean up unused Docker images to free up disk space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "🎉 Deployment completely successfully! Your app is now running the latest code."
