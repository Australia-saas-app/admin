#!/bin/bash

# Commercial & Industrial Service Docker Commands
# Quick reference for building and running the service

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Commercial & Industrial Service Docker Commands ===${NC}\n"

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t vero2-commercial-industrial-service:latest .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful!${NC}\n"
else
    echo -e "${RED}✗ Build failed!${NC}\n"
    exit 1
fi

# Stop and remove existing container if it exists
echo -e "${YELLOW}Cleaning up existing container...${NC}"
docker stop vero2-commercial-industrial-service 2>/dev/null
docker rm vero2-commercial-industrial-service 2>/dev/null
echo -e "${GREEN}✓ Cleanup complete${NC}\n"

# Run container
echo -e "${YELLOW}Starting container...${NC}"
docker run -d \
  --name vero2-commercial-industrial-service \
  --env-file .env \
  -p 3021:3021 \
  --restart unless-stopped \
  vero2-commercial-industrial-service:latest

# Check if container started successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Container started successfully!${NC}\n"
    
    # Wait a moment for service to start
    echo -e "${YELLOW}Waiting for service to start...${NC}"
    sleep 5
    
    # Check health
    echo -e "${YELLOW}Checking service health...${NC}"
    curl -f http://localhost:3021/api/commercial-industrial/health > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Service is healthy!${NC}\n"
        echo -e "${GREEN}Service is running on: http://localhost:3021${NC}"
        echo -e "${GREEN}Health check: http://localhost:3021/api/commercial-industrial/health${NC}"
        echo -e "${GREEN}API docs: http://localhost:3021/api/commercial-industrial/docs${NC}\n"
    else
        echo -e "${RED}⚠ Service might not be ready yet. Check logs with:${NC}"
        echo -e "${YELLOW}docker logs vero2-commercial-industrial-service${NC}\n"
    fi
    
    echo -e "${YELLOW}Useful commands:${NC}"
    echo -e "  View logs:     ${GREEN}docker logs -f vero2-commercial-industrial-service${NC}"
    echo -e "  Stop service:  ${GREEN}docker stop vero2-commercial-industrial-service${NC}"
    echo -e "  Start service: ${GREEN}docker start vero2-commercial-industrial-service${NC}"
    echo -e "  Remove:        ${GREEN}docker rm -f vero2-commercial-industrial-service${NC}"
else
    echo -e "${RED}✗ Failed to start container!${NC}\n"
    echo -e "${YELLOW}Check logs with: docker logs vero2-commercial-industrial-service${NC}"
    exit 1
fi




