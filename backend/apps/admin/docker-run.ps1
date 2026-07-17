# PowerShell script to run Admin Service with Docker

Write-Host "🚀 Starting Admin Service with Docker..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created. Please update it with your configuration." -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example not found. Please create .env file manually." -ForegroundColor Red
        exit 1
    }
}

# Check if Docker is running
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is running" -ForegroundColor Green

# Build and start services
Write-Host "📦 Building and starting services..." -ForegroundColor Cyan
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Admin Service: http://localhost:3007/admin-service" -ForegroundColor Cyan
    Write-Host "📍 Health Check: http://localhost:3007/admin-service/health" -ForegroundColor Cyan
    Write-Host "📍 API Docs: http://localhost:3007/admin-service/docs" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 View logs: docker-compose logs -f admin-service" -ForegroundColor Yellow
    Write-Host "🛑 Stop services: docker-compose down" -ForegroundColor Yellow
    Write-Host ""
    
    # Wait a bit for services to start
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check health
    Write-Host "🔍 Checking health..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3007/admin-service/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Admin Service is healthy!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Health check failed. Service may still be starting..." -ForegroundColor Yellow
        Write-Host "   Check logs: docker-compose logs admin-service" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Failed to start services. Check logs: docker-compose logs" -ForegroundColor Red
    exit 1
}

