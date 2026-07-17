# Technology Service Docker Run Script for Windows PowerShell
# Usage: .\docker-run.ps1

Write-Host "=== Technology Service Docker Commands ===" -ForegroundColor Green
Write-Host ""

# Build Docker image
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t vero2-technology-service:latest .

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Stop and remove existing container if it exists
Write-Host "Cleaning up existing container..." -ForegroundColor Yellow
docker stop vero2-technology-service 2>$null
docker rm vero2-technology-service 2>$null
Write-Host "✓ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Run container
Write-Host "Starting container..." -ForegroundColor Yellow
docker run -d `
  --name vero2-technology-service `
  --env-file .env `
  -p 3011:3011 `
  --restart unless-stopped `
  vero2-technology-service:latest

# Check if container started successfully
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Container started successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Wait a moment for service to start
    Write-Host "Waiting for service to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Check health
    Write-Host "Checking service health..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3011/api/technical/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Service is healthy!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Service is running on: http://localhost:3011" -ForegroundColor Green
            Write-Host "Health check: http://localhost:3011/api/technical/health" -ForegroundColor Green
            Write-Host "API docs: http://localhost:3011/api/technical/docs" -ForegroundColor Green
            Write-Host ""
        }
    } catch {
        Write-Host "⚠ Service might not be ready yet. Check logs with:" -ForegroundColor Yellow
        Write-Host "docker logs vero2-technology-service" -ForegroundColor Yellow
        Write-Host ""
    }
    
    Write-Host "Useful commands:" -ForegroundColor Yellow
    Write-Host "  View logs:     docker logs -f vero2-technology-service" -ForegroundColor Green
    Write-Host "  Stop service:  docker stop vero2-technology-service" -ForegroundColor Green
    Write-Host "  Start service: docker start vero2-technology-service" -ForegroundColor Green
    Write-Host "  Remove:        docker rm -f vero2-technology-service" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to start container!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check logs with: docker logs vero2-technology-service" -ForegroundColor Yellow
    exit 1
}




