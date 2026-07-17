# Construction Service Docker Run Script (PowerShell)

Write-Host "🚀 Starting Construction Service with Docker..." -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path env.template) {
        Copy-Item env.template .env
        Write-Host "✅ Created .env from template. Please update it with your configuration." -ForegroundColor Green
    } else {
        Write-Host "❌ env.template not found. Please create .env file manually." -ForegroundColor Red
        exit 1
    }
}

# Build and run with docker-compose
Write-Host "📦 Building Docker image..." -ForegroundColor Cyan
docker-compose build

Write-Host "🚀 Starting services..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "⏳ Waiting for service to be healthy..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check health
Write-Host "🏥 Checking service health..." -ForegroundColor Cyan
$maxAttempts = 30
$attempt = 0
$healthy = $false

while ($attempt -lt $maxAttempts -and -not $healthy) {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3011/api/construction/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $healthy = $true
            Write-Host "✅ Construction Service is running!" -ForegroundColor Green
            Write-Host "📍 Health check: http://localhost:3011/api/construction/health" -ForegroundColor Cyan
            Write-Host "📍 API Documentation: http://localhost:3011/api/construction/docs" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "📊 Service status:" -ForegroundColor Cyan
            docker-compose ps
            exit 0
        }
    } catch {
        Write-Host "   Waiting... ($attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $healthy) {
    Write-Host "❌ Service did not become healthy. Check logs with: docker-compose logs construction-service" -ForegroundColor Red
    docker-compose logs construction-service
    exit 1
}


