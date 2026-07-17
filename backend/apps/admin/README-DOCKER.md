# Admin Service - Docker Quick Start

## 🚀 Quick Start (3 Steps)

### Step 1: Create Environment File
```powershell
# Windows PowerShell
Copy-Item .env.example .env

# Or manually create .env with:
ADMIN_PORT=3007
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vero2_admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DB_NAME=vero2
ADMIN_BOOTSTRAP_SECRET=change-me-bootstrap
```

### Step 2: Start Services
```powershell
# Windows PowerShell
.\docker-run.ps1

# Or manually:
docker-compose up --build -d
```

### Step 3: Test in Postman
1. Import `Admin-Service.postman_collection.json`
2. Create admin: `POST /auth/admin/register`
3. Login: `POST /auth/admin/login` (token auto-saved)
4. Test blog routes: `GET /menu/blogs`

## 📍 Endpoints

- **Service**: http://localhost:3007/admin-service
- **Health**: http://localhost:3007/admin-service/health
- **API Docs**: http://localhost:3007/admin-service/docs

## 🧪 Test Blog Routes

All routes require `Authorization: Bearer {{token}}` header:

1. **List Blogs**: `GET /menu/blogs?page=1&limit=10&search=`
2. **Create Blog**: `POST /menu/blogs`
   ```json
   {
     "photo": "https://example.com/blog.jpg",
     "title": "My First Blog",
     "tag": "tutorial, nestjs",
     "description": "Blog content here..."
   }
   ```
3. **Update Blog**: `PATCH /menu/blogs/BLOG1234567890ABC`
4. **Delete Blog**: `DELETE /menu/blogs/BLOG1234567890ABC`
5. **Toggle Visibility**: `PATCH /menu/blogs/BLOG1234567890ABC/visibility`
6. **Reorder**: `POST /menu/blogs/reorder`

## 🛠️ Useful Commands

```bash
# View logs
docker-compose logs -f admin-service

# Stop services
docker-compose down

# Restart service
docker-compose restart admin-service

# Rebuild after code changes
docker-compose up --build -d admin-service

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d vero2_admin

# Access MongoDB
docker-compose exec mongo mongosh -u admin -p admin123 --authenticationDatabase admin
```

## ✅ Verification Checklist

- [ ] Services running: `docker-compose ps`
- [ ] Health check: `curl http://localhost:3007/admin-service/health`
- [ ] Admin account created
- [ ] Token obtained from login
- [ ] Blog routes tested in Postman

## 📚 Full Documentation

See `DOCKER-SETUP.md` for detailed setup instructions.

