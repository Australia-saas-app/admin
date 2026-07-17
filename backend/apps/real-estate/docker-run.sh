#!/bin/bash

# Real Estate Service Docker Run Script

echo "🚀 Starting Real Estate Service with Docker..."

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
    if curl -f http://localhost:3013/api/real-estate/health > /dev/null 2>&1; then
        echo "✅ Real Estate Service is running!"
        echo "📍 Health check: http://localhost:3013/api/real-estate/health"
        echo "📍 API Documentation: http://localhost:3013/api/real-estate/docs"
        echo ""
        echo "📊 Service status:"
        docker-compose ps
        exit 0
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

echo "❌ Service did not become healthy. Check logs with: docker-compose logs real-estate-service"
docker-compose logs real-estate-service
exit 1


