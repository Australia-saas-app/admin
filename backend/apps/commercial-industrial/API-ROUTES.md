# Commercial & Industrial Service API Routes

## Base URL
```
http://localhost:3021/api/commercial-industrial
```

## Authentication
- **User/Agency Token**: Get from `POST http://localhost:3001/sso/auth/user/login`
- **Admin Token**: Get from `POST http://localhost:3001/sso/auth/admin/login`

---

## 📋 Route Summary

### Public Routes (No Authentication)
- `GET /services` - Get all visible services
- `GET /services/:serviceId` - Get single service (visible only)
- `GET /services/categories/list` - Get all active categories

### User/Agency Routes (Requires User Token)
- `POST /services` - **Create service** (Users/Agencies can create)

### Admin Routes (Requires Admin Token)
- `GET /services/admin/list` - Get all services (including hidden)
- `GET /services/admin/:serviceId` - Get single service (any visibility)
- `PATCH /services/:serviceId` - Update service
- `DELETE /services/:serviceId` - Delete service
- `PATCH /services/:serviceId/visibility` - **Manage visibility** (Admin only)
- `PATCH /services/:serviceId/reorder` - Reorder service
- `POST /services/categories` - Create category
- `GET /services/admin/categories/list` - Get all categories
- `GET /services/admin/categories/:categoryId` - Get category
- `PATCH /services/categories/:categoryId` - Update category
- `DELETE /services/categories/:categoryId` - Delete category

---

## 🔐 Authentication Flow

### 1. Get User Token (for creating services)
```http
POST http://localhost:3001/sso/auth/user/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "NewSecret123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "userId": "USER000001",
      "accountType": "user"
    }
  }
}
```

### 2. Get Admin Token (for managing services)
```http
POST http://localhost:3001/sso/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "admin": {
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

---

## 📝 Complete Route Details

### Health Check

#### GET /health
Public endpoint to check service status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T05:00:00.000Z"
}
```

---

### Services - Public Routes

#### GET /services
Get all visible services (public).

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string, optional) - Search by title
- `category` (string, optional) - Filter by category name
- `isVisible` (ignored - always returns visible only)

**Example:**
```http
GET /services?page=1&limit=10&search=web&category=Web%20Development
```

#### GET /services/:serviceId
Get single service by ID (visible services only).

**Example:**
```http
GET /services/TECH-MI44U6VB-0OOGT7
```

---

### Services - User/Agency Routes

#### POST /services
**Create service** (Users/Agencies can create).

**⚠️ Requires:** User token (`Bearer {{user_token}}`)

**Request Body:**
```json
{
  "title": "Web Development",
  "photo": "https://example.com/photo.jpg",
  "tag": "frontend",
  "category": "Web Development",
  "description": "Professional web development services",
  "displayOrder": 1,
  "isVisible": true
}
```

**Response:**
```json
{
  "serviceId": "TECH-MI44U6VB-0OOGT7",
  "title": "Web Development",
  "category": "Web Development",
  "createdBy": "USER000001",
  "isVisible": true,
  "createdAt": "2025-11-18T05:00:00.000Z"
}
```

**Note:** 
- Category will be auto-created if it doesn't exist
- Service is created by the authenticated user/agency
- After creation, visibility can be managed by admins

---

### Services - Admin Routes

#### GET /services/admin/list
Get all services including hidden ones (Admin).

**⚠️ Requires:** Admin token (`Bearer {{admin_token}}`)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional)
- `isVisible` (boolean, optional) - Filter by visibility
- `category` (string, optional)

**Example:**
```http
GET /services/admin/list?page=1&limit=10&isVisible=true
```

#### GET /services/admin/:serviceId
Get single service by ID (any visibility - Admin).

**⚠️ Requires:** Admin token

#### PATCH /services/:serviceId
Update service (Admin).

**⚠️ Requires:** Admin token

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isVisible": true
}
```

#### DELETE /services/:serviceId
Delete service (Admin).

**⚠️ Requires:** Admin token

#### PATCH /services/:serviceId/visibility
**Toggle service visibility** (Admin ONLY).

**⚠️ REQUIRES ADMIN TOKEN** - This is an admin-only operation.

**Request Body:**
```json
{
  "isVisible": false
}
```

**Note:** 
- Users/agencies can CREATE services but cannot change visibility
- Only admins can manage visibility
- Hidden services won't appear in public listings

#### PATCH /services/:serviceId/reorder
Reorder service (Admin).

**⚠️ Requires:** Admin token

**Request Body:**
```json
{
  "direction": "up"
}
```
or
```json
{
  "direction": "down"
}
```

---

### Categories - Public Routes

#### GET /services/categories/list
Get all active categories (public).

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `isActive` (ignored - always returns active only)

---

### Categories - Admin Routes

#### POST /services/categories
Create category (Admin).

**⚠️ Requires:** Admin token

**Request Body:**
```json
{
  "name": "Web Development",
  "description": "Web development services",
  "displayOrder": 1,
  "isActive": true
}
```

#### GET /services/admin/categories/list
Get all categories including inactive (Admin).

**⚠️ Requires:** Admin token

#### GET /services/admin/categories/:categoryId
Get single category (Admin).

**⚠️ Requires:** Admin token

#### PATCH /services/categories/:categoryId
Update category (Admin).

**⚠️ Requires:** Admin token

#### DELETE /services/categories/:categoryId
Delete category (Admin).

**⚠️ Requires:** Admin token

**Note:** Only allowed if no services are using this category.

---

## 🔑 Key Points

1. **Creating Services:**
   - ✅ Users/Agencies can create services
   - Requires: `user_token` from user login
   - Endpoint: `POST /services`

2. **Managing Visibility:**
   - ⚠️ **Admin-only operation**
   - Requires: `admin_token` from admin login
   - Endpoint: `PATCH /services/:serviceId/visibility`
   - Users cannot change visibility of their own services

3. **Token Types:**
   - `user_token` = `aud: "first-party-app"` (from `/auth/user/login`)
   - `admin_token` = `aud: "admin"` (from `/auth/admin/login`)

4. **Why Visibility is Admin-Only:**
   - Visibility management is a content moderation function
   - Prevents users from hiding/inappropriate content
   - Admins control what appears on public website
   - This is standard practice in content management systems

---

## 🧪 Testing Checklist

### User/Agency Testing
- [ ] Login as user → Get `user_token`
- [ ] Create service with `user_token` → Should succeed
- [ ] Try to change visibility with `user_token` → Should fail (401)
- [ ] View created service in public listing → Should appear if visible

### Admin Testing
- [ ] Login as admin → Get `admin_token`
- [ ] Create service with `admin_token` → Should succeed (but use user token normally)
- [ ] Change visibility with `admin_token` → Should succeed
- [ ] Update service with `admin_token` → Should succeed
- [ ] Delete service with `admin_token` → Should succeed
- [ ] View all services (including hidden) → Should show all

---

## 📚 Related Documentation

- [POSTMAN-SETUP.md](./POSTMAN-SETUP.md) - How to use Postman collection
- [QUICK-START.md](./QUICK-START.md) - Quick start guide
- [DOCKER-COMMANDS.md](./DOCKER-COMMANDS.md) - Docker commands




