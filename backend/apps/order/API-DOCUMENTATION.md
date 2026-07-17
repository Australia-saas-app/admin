# Technology Service API Documentation

## Base URL
- Development: `http://localhost:3011/api/technical`
- Production: `https://api.yourdomain.com/api/technical`

## Authentication

### Public Routes
- No authentication required

### Admin Routes
- Requires JWT Bearer Token in Authorization header
- Token format: `Bearer <token>`
- Token must be issued by SSO Service (Port 3001)
- Admin role required: `admin`, `sub-admin`, or `super_admin`

---

## Endpoints

### 🏥 Health Check

#### GET `/health`
Check service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "technology-service",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 📋 Services

#### GET `/services`
Get all visible technical services (Public).

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by title
- `category` (optional) - Filter by category name

**Response:**
```json
{
  "services": [
    {
      "id": 1,
      "serviceId": "TECH-xxx-xxx",
      "title": "Web Development",
      "photo": "https://example.com/photo.jpg",
      "tag": "frontend",
      "serviceType": "technical",
      "categoryId": 1,
      "categoryName": "Web Development",
      "description": "Professional web development services",
      "displayOrder": 1,
      "isVisible": true,
      "createdBy": "admin@example.com",
      "updatedBy": "admin@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### GET `/services/:serviceId`
Get single service details (Public).

**Response:**
```json
{
  "id": 1,
  "serviceId": "TECH-xxx-xxx",
  "title": "Web Development",
  "photo": "https://example.com/photo.jpg",
  "tag": "frontend",
  "serviceType": "technical",
  "categoryId": 1,
  "categoryName": "Web Development",
  "description": "Professional web development services",
  "displayOrder": 1,
  "isVisible": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "category": {
    "id": 1,
    "categoryId": "TECH-CAT-xxx",
    "name": "Web Development",
    "description": "Web development services",
    "serviceType": "technical",
    "displayOrder": 1,
    "isActive": true
  }
}
```

#### POST `/services` (Admin)
Create new technical service.

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

**Response:** 201 Created
```json
{
  "id": 1,
  "serviceId": "TECH-xxx-xxx",
  "title": "Web Development",
  "photo": "https://example.com/photo.jpg",
  "tag": "frontend",
  "serviceType": "technical",
  "categoryId": 1,
  "categoryName": "Web Development",
  "description": "Professional web development services",
  "displayOrder": 1,
  "isVisible": true,
  "createdBy": "admin@example.com",
  "updatedBy": "admin@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET `/services/admin/list` (Admin)
Get all services including hidden ones.

**Query Parameters:** Same as GET `/services`

#### GET `/services/admin/:serviceId` (Admin)
Get service (any visibility status).

#### PATCH `/services/:serviceId` (Admin)
Update service.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isVisible": false
}
```

#### DELETE `/services/:serviceId` (Admin)
Delete service.

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

#### PATCH `/services/:serviceId/visibility` (Admin)
Toggle service visibility.

**Request Body:**
```json
{
  "isVisible": false
}
```

#### PATCH `/services/:serviceId/reorder` (Admin)
Reorder service (move up or down).

**Request Body:**
```json
{
  "direction": "up"
}
```

**Valid directions:** `up`, `down`

---

### 📁 Categories

#### GET `/services/categories/list`
Get all active categories (Public).

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 50)
- `isActive` (optional) - Filter by active status

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "categoryId": "TECH-CAT-xxx",
      "name": "Web Development",
      "description": "Web development services",
      "serviceType": "technical",
      "displayOrder": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 10,
    "pages": 1
  }
}
```

#### POST `/services/categories` (Admin)
Create new category.

**Request Body:**
```json
{
  "name": "Web Development",
  "description": "Web development services",
  "displayOrder": 1,
  "isActive": true
}
```

#### GET `/services/admin/categories/list` (Admin)
Get all categories (including inactive).

#### GET `/services/admin/categories/:categoryId` (Admin)
Get category details.

#### PATCH `/services/categories/:categoryId` (Admin)
Update category.

#### DELETE `/services/categories/:categoryId` (Admin)
Delete category (only if not in use).

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error if category is in use:**
```json
{
  "statusCode": 400,
  "message": "Cannot delete category. 5 service(s) are using it."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Authorization header missing",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Admin privileges required",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Service with ID TECH-xxx-xxx not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Category \"Web Development\" already exists for technical services",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Features

### Service Management
- ✅ Create, Read, Update, Delete services
- ✅ Toggle visibility (show/hide from public)
- ✅ Search by title
- ✅ Filter by category
- ✅ Reorder services (up/down)
- ✅ Pagination support
- ✅ Auto-generate unique service IDs

### Category Management
- ✅ Create, Read, Update, Delete categories
- ✅ Auto-create categories when service is created
- ✅ Prevent deletion if category is in use
- ✅ Filter by active status
- ✅ Pagination support
- ✅ Auto-generate unique category IDs

### Security
- ✅ JWT authentication via SSO Service
- ✅ Admin role verification
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet.js security headers

---

## Swagger Documentation

Interactive API documentation available at:
- Development: `http://localhost:3011/api/technical/docs`




