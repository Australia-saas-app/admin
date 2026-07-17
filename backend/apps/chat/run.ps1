# PowerShell script to run Chat Service with Docker Compose

Write-Host "Starting Chat Service with Docker Compose..." -ForegroundColor Green

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "Docker is running ✓" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from env.template..." -ForegroundColor Yellow
    if (Test-Path "env.template") {
        Copy-Item "env.template" ".env"
        Write-Host "Please update .env file with your configuration before continuing." -ForegroundColor Yellow
        Write-Host "Press any key to continue after updating .env..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } else {
        Write-Host "ERROR: env.template not found!" -ForegroundColor Red
        exit 1
    }
}

# Start services
Write-Host "`nStarting services..." -ForegroundColor Yellow
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Services started successfully!" -ForegroundColor Green
    Write-Host "`nService URLs:" -ForegroundColor Cyan
    Write-Host "  Chat Service: http://localhost:3006/api/chat" -ForegroundColor White
    Write-Host "  Health Check: http://localhost:3006/api/chat/health" -ForegroundColor White
    Write-Host "  MongoDB: localhost:27017" -ForegroundColor White
    Write-Host "  Redis: localhost:6379" -ForegroundColor White
    Write-Host "`nUseful commands:" -ForegroundColor Yellow
    Write-Host "  View logs: docker-compose logs -f chat-service" -ForegroundColor White
    Write-Host "  Stop services: docker-compose down" -ForegroundColor White
    Write-Host "  Check status: docker-compose ps" -ForegroundColor White
} else {
    Write-Host "`n✗ Failed to start services!" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}

