#!/bin/bash

# Construction Service Docker Run Script

echo "🚀 Starting Construction Service with Docker..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f env.template ]; then
        cp env.template .env
        echo "✅ Created .env from template. Please update it with your configuration."
    else
        echo "❌ env.template not found. Please create .env file manually."
        exit 1
    fi
fi

# Build and run with docker-compose
echo "📦 Building Docker image..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for service to be healthy..."
sleep 5

# Check health
echo "🏥 Checking service health..."
for i in {1..30}; do
    if curl -f http://localhost:3011/api/construction/health > /dev/null 2>&1; then
        echo "✅ Construction Service is running!"
        echo "📍 Health check: http://localhost:3011/api/construction/health"
        echo "📍 API Documentation: http://localhost:3011/api/construction/docs"
        echo ""
        echo "📊 Service status:"
        docker-compose ps
        exit 0
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

echo "❌ Service did not become healthy. Check logs with: docker-compose logs construction-service"
docker-compose logs construction-service
exit 1


