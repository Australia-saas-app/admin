# PowerShell script to rebuild Technology Service Docker image without cache
# Usage: .\rebuild-fix.ps1

Write-Host "=== Rebuilding Technology Service (No Cache) ===" -ForegroundColor Green
Write-Host ""

# Stop and remove existing container
Write-Host "Stopping and removing existing container..." -ForegroundColor Yellow
docker stop vero2-technology-service 2>$null
docker rm vero2-technology-service 2>$null

# Remove old image
Write-Host "Removing old image..." -ForegroundColor Yellow
docker rmi vero2-technology-service:latest 2>$null

Write-Host "✓ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Build new image without cache
Write-Host "Building new image (without cache)..." -ForegroundColor Yellow
docker build --no-cache -t vero2-technology-service:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful!" -ForegroundColor Green
    Write-Host ""
    
    # Verify package.json in image
    Write-Host "Verifying package.json..." -ForegroundColor Yellow
    docker run --rm vero2-technology-service:latest cat package.json | Select-String "vero2-technology-service"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Package.json verified!" -ForegroundColor Green
    } else {
        Write-Host "⚠ Warning: Could not verify package.json" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Now run:" -ForegroundColor Cyan
    Write-Host "  docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 --restart unless-stopped vero2-technology-service:latest" -ForegroundColor Cyan
} else {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}




