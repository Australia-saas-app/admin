# Script to get SSO Public Key from SSO service
Write-Host "=== Getting SSO Public Key ===" -ForegroundColor Green
Write-Host ""

# Check if SSO service is running
$ssoRunning = docker ps --filter "name=vero2-sso" --format "{{.Names}}"
if (-not $ssoRunning) {
    Write-Host "❌ SSO service (vero2-sso) is not running!" -ForegroundColor Red
    Write-Host "Start it first with: docker-compose up -d sso" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ SSO service is running" -ForegroundColor Green
Write-Host ""

# Try to get key from environment variable
Write-Host "Attempting to get SSO_PUBLIC_KEY from SSO container..." -ForegroundColor Cyan
$envVar = docker exec vero2-sso sh -c 'printenv SSO_PUBLIC_KEY' 2>&1

if ($envVar -and $envVar -like "-----BEGIN PUBLIC KEY-----*") {
    Write-Host "✓ Found SSO_PUBLIC_KEY in container" -ForegroundColor Green
    
    # Update .env file
    $envContent = Get-Content .env -Raw -ErrorAction SilentlyContinue
    if ($envContent) {
        # Escape special characters for regex
        $escapedKey = $envVar -replace '([\\$.*+?()[{}|])', '\$1' -replace "`n", "\\n"
        $envContent = $envContent -replace "SSO_PUBLIC_KEY=.*", "SSO_PUBLIC_KEY=$envVar"
        $envContent | Set-Content .env -NoNewline
        Write-Host "✓ Updated SSO_PUBLIC_KEY in .env file" -ForegroundColor Green
    } else {
        Write-Host "⚠ .env file not found. Creating it..." -ForegroundColor Yellow
        Copy-Item env.template .env -ErrorAction SilentlyContinue
        $envContent = Get-Content .env -Raw
        $envContent = $envContent -replace "SSO_PUBLIC_KEY=.*", "SSO_PUBLIC_KEY=$envVar"
        $envContent | Set-Content .env -NoNewline
        Write-Host "✓ Created .env with SSO_PUBLIC_KEY" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Key preview (first 100 chars):" -ForegroundColor Cyan
    $envVar.Substring(0, [Math]::Min(100, $envVar.Length))
} else {
    Write-Host "⚠ Could not get SSO_PUBLIC_KEY from container" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please manually set SSO_PUBLIC_KEY in .env file" -ForegroundColor Yellow
    Write-Host "You can get it from:" -ForegroundColor Cyan
    Write-Host "  1. Your main .env file (at project root)" -ForegroundColor White
    Write-Host "  2. Or check SSO service logs" -ForegroundColor White
    Write-Host ""
    Write-Host "After updating SSO_PUBLIC_KEY, rebuild the container:" -ForegroundColor Cyan
    Write-Host "  docker stop vero2-technology-service" -ForegroundColor White
    Write-Host "  docker rm vero2-technology-service" -ForegroundColor White
    Write-Host "  docker build -t vero2-technology-service:latest ." -ForegroundColor White
    Write-Host "  docker run -d --name vero2-technology-service --env-file .env --network vero2new_vero2-network -p 3011:3011 --restart unless-stopped vero2-technology-service:latest" -ForegroundColor White
}




