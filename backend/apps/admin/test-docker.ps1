# Quick test script for Docker setup

Write-Host "🧪 Testing Admin Service Docker Setup..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if services are running
Write-Host "1️⃣ Checking if services are running..." -ForegroundColor Yellow
$services = docker-compose ps --format json | ConvertFrom-Json
$adminService = $services | Where-Object { $_.Service -eq "admin-service" }
if ($adminService -and $adminService.State -eq "running") {
    Write-Host "   ✅ Admin Service is running" -ForegroundColor Green
} else {
    Write-Host "   ❌ Admin Service is not running" -ForegroundColor Red
    Write-Host "   Run: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

# Test 2: Health check
Write-Host "2️⃣ Testing health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3007/admin-service/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Health check passed" -ForegroundColor Green
        $health = $response.Content | ConvertFrom-Json
        Write-Host "   Status: $($health.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Check API docs
Write-Host "3️⃣ Testing API documentation endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3007/admin-service/docs" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ API docs accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  API docs not accessible (may need SSO setup)" -ForegroundColor Yellow
}

# Test 4: Check database connections
Write-Host "4️⃣ Checking database connections..." -ForegroundColor Yellow

# PostgreSQL
$pgCheck = docker-compose exec -T postgres pg_isready -U postgres 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ PostgreSQL is ready" -ForegroundColor Green
} else {
    Write-Host "   ❌ PostgreSQL is not ready" -ForegroundColor Red
}

# MongoDB
$mongoCheck = docker-compose exec -T mongo mongosh --quiet --eval "db.adminCommand('ping')" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ MongoDB is ready" -ForegroundColor Green
} else {
    Write-Host "   ❌ MongoDB is not ready" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Import Admin-Service.postman_collection.json in Postman" -ForegroundColor White
Write-Host "   2. Create admin: POST /auth/admin/register" -ForegroundColor White
Write-Host "   3. Login: POST /auth/admin/login" -ForegroundColor White
Write-Host "   4. Test blog routes: GET /menu/blogs" -ForegroundColor White
Write-Host ""

