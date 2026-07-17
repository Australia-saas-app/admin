#!/bin/bash
# Bash script to run Chat Service with Docker Compose

echo "Starting Chat Service with Docker Compose..."

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "ERROR: Docker is not running. Please start Docker first."
    exit 1
fi

echo "Docker is running ✓"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    echo "Creating .env from env.template..."
    if [ -f "env.template" ]; then
        cp env.template .env
        echo "Please update .env file with your configuration before continuing."
        read -p "Press Enter to continue after updating .env..."
    else
        echo "ERROR: env.template not found!"
        exit 1
    fi
fi

# Start services
echo ""
echo "Starting services..."
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Services started successfully!"
    echo ""
    echo "Service URLs:"
    echo "  Chat Service: http://localhost:3006/api/chat"
    echo "  Health Check: http://localhost:3006/api/chat/health"
    echo "  MongoDB: localhost:27017"
    echo "  Redis: localhost:6379"
    echo ""
    echo "Useful commands:"
    echo "  View logs: docker-compose logs -f chat-service"
    echo "  Stop services: docker-compose down"
    echo "  Check status: docker-compose ps"
else
    echo ""
    echo "✗ Failed to start services!"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

