#!/bin/bash

# Bash script to run Admin Service with Docker

echo "🚀 Starting Admin Service with Docker..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created. Please update it with your configuration."
    else
        echo "❌ .env.example not found. Please create .env file manually."
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

echo "✅ Docker is running"

# Build and start services
echo "📦 Building and starting services..."
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo "✅ Services started successfully!"
    echo ""
    echo "📍 Admin Service: http://localhost:3007/admin-service"
    echo "📍 Health Check: http://localhost:3007/admin-service/health"
    echo "📍 API Docs: http://localhost:3007/admin-service/docs"
    echo ""
    echo "📋 View logs: docker-compose logs -f admin-service"
    echo "🛑 Stop services: docker-compose down"
    echo ""
    
    # Wait a bit for services to start
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check health
    echo "🔍 Checking health..."
    if curl -f http://localhost:3007/admin-service/health > /dev/null 2>&1; then
        echo "✅ Admin Service is healthy!"
    else
        echo "⚠️  Health check failed. Service may still be starting..."
        echo "   Check logs: docker-compose logs admin-service"
    fi
else
    echo "❌ Failed to start services. Check logs: docker-compose logs"
    exit 1
fi

