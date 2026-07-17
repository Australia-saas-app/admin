# PowerShell script to create .env file from .env.example
# Usage: .\create-env.ps1

Write-Host "=== Creating .env file ===" -ForegroundColor Green
Write-Host ""

if (Test-Path ".env") {
    Write-Host "⚠ .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled. Using existing .env file." -ForegroundColor Yellow
        exit 0
    }
}

if (Test-Path "env.template") {
    Copy-Item "env.template" ".env"
    Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ IMPORTANT: Edit .env file and update the following:" -ForegroundColor Yellow
    Write-Host "  - DB_PASSWORD: Your PostgreSQL password" -ForegroundColor Yellow
    Write-Host "  - SSO_PUBLIC_KEY: Your SSO public key" -ForegroundColor Yellow
    Write-Host "  - DB_HOST: Use 'host.docker.internal' for Windows/Mac" -ForegroundColor Yellow
    Write-Host "              Use actual IP or '172.17.0.1' for Linux" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After editing, run:" -ForegroundColor Cyan
    Write-Host "  docker run -d --name vero2-commercial-industrial-service --env-file .env -p 3021:3021 --restart unless-stopped vero2-commercial-industrial-service:latest" -ForegroundColor Cyan
} else {
    Write-Host "✗ .env.example file not found!" -ForegroundColor Red
    Write-Host "Creating default .env file..." -ForegroundColor Yellow
    
    @"
# Server Configuration
PORT=3021
NODE_ENV=development

# Database Configuration
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2

# SSO Authentication
SSO_PUBLIC_KEY=your_sso_public_key_here
SSO_ISSUER=http://localhost:3001/sso

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
"@ | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "✓ Created default .env file" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ IMPORTANT: Edit .env file and update the values!" -ForegroundColor Yellow
}

