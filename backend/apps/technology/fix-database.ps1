# Quick fix script for database connection
Write-Host "=== Fixing Database Connection ===" -ForegroundColor Green
Write-Host ""

$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Run: .\create-env.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "Current database settings:" -ForegroundColor Cyan
Get-Content $envFile | Select-String -Pattern "DB_" | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
Write-Host ""

Write-Host "Please provide the following:" -ForegroundColor Yellow
Write-Host ""

# Get PostgreSQL password
$currentPassword = (Get-Content $envFile | Select-String -Pattern "^DB_PASSWORD=" | ForEach-Object { $_.ToString().Split('=')[1] }) -replace '"', ''

if ($currentPassword -eq "your_password") {
    Write-Host "⚠ DB_PASSWORD is still set to 'your_password' (placeholder)" -ForegroundColor Yellow
    Write-Host ""
    $dbPassword = Read-Host "Enter PostgreSQL password (press Enter to keep current)"
    if ($dbPassword) {
        (Get-Content $envFile) -replace "^DB_PASSWORD=.*", "DB_PASSWORD=$dbPassword" | Set-Content $envFile
        Write-Host "✓ Updated DB_PASSWORD" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Database Configuration Options:" -ForegroundColor Cyan
Write-Host "1. Use existing PostgreSQL (you know the password)" -ForegroundColor White
Write-Host "2. Connect to Docker Compose PostgreSQL (use postgres_admin password)" -ForegroundColor White
Write-Host "3. Create new database/user for Technology Service" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose option (1/2/3) or press Enter to just restart container"

switch ($choice) {
    "1" {
        Write-Host "Make sure DB_PASSWORD in .env matches your PostgreSQL password" -ForegroundColor Yellow
    }
    "2" {
        Write-Host "Updating to use Docker Compose PostgreSQL..." -ForegroundColor Cyan
        (Get-Content $envFile) -replace "^DB_USERNAME=.*", "DB_USERNAME=postgres_admin" | Set-Content $envFile
        (Get-Content $envFile) -replace "^DB_NAME=.*", "DB_NAME=vero2_technology" | Set-Content $envFile
        Write-Host "✓ Updated DB_USERNAME and DB_NAME" -ForegroundColor Green
        Write-Host "⚠ Update DB_PASSWORD to match POSTGRES_PASSWORD from docker-compose .env" -ForegroundColor Yellow
    }
    "3" {
        Write-Host ""
        Write-Host "Run these SQL commands in PostgreSQL:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  CREATE USER vero2_technology_app WITH PASSWORD 'your_password_here';" -ForegroundColor White
        Write-Host "  CREATE DATABASE vero2_technology OWNER vero2_technology_app;" -ForegroundColor White
        Write-Host "  GRANT ALL PRIVILEGES ON DATABASE vero2_technology TO vero2_technology_app;" -ForegroundColor White
        Write-Host ""
        $updateEnv = Read-Host "Update .env with these credentials? (y/N)"
        if ($updateEnv -eq "y" -or $updateEnv -eq "Y") {
            $newPassword = Read-Host "Enter password for vero2_technology_app"
            (Get-Content $envFile) -replace "^DB_USERNAME=.*", "DB_USERNAME=vero2_technology_app" | Set-Content $envFile
            (Get-Content $envFile) -replace "^DB_PASSWORD=.*", "DB_PASSWORD=$newPassword" | Set-Content $envFile
            (Get-Content $envFile) -replace "^DB_NAME=.*", "DB_NAME=vero2_technology" | Set-Content $envFile
            Write-Host "✓ Updated .env with new credentials" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Verify .env has correct database credentials" -ForegroundColor White
Write-Host "2. Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "3. Restart the container:" -ForegroundColor White
Write-Host "   docker restart vero2-technology-service" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check logs:" -ForegroundColor White
Write-Host "   docker logs -f vero2-technology-service" -ForegroundColor Cyan




