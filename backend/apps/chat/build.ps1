# PowerShell script to build Chat Service Docker image

Write-Host "Building Chat Service Docker image..." -ForegroundColor Green

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "Docker is running ✓" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Build the image
Write-Host "`nBuilding image: vero2-chat-service:latest" -ForegroundColor Yellow
docker build -t vero2-chat-service:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Build successful!" -ForegroundColor Green
    Write-Host "Image created: vero2-chat-service:latest" -ForegroundColor Cyan
    Write-Host "`nTo run the service, use:" -ForegroundColor Yellow
    Write-Host "  docker-compose up -d" -ForegroundColor White
} else {
    Write-Host "`n✗ Build failed!" -ForegroundColor Red
    exit 1
}

