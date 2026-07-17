#!/bin/bash
# Bash script to build Chat Service Docker image

echo "Building Chat Service Docker image..."

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "ERROR: Docker is not running. Please start Docker first."
    exit 1
fi

echo "Docker is running ✓"

# Build the image
echo ""
echo "Building image: vero2-chat-service:latest"
docker build -t vero2-chat-service:latest .

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Build successful!"
    echo "Image created: vero2-chat-service:latest"
    echo ""
    echo "To run the service, use:"
    echo "  docker-compose up -d"
else
    echo ""
    echo "✗ Build failed!"
    exit 1
fi

