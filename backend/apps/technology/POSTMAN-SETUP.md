# Postman Collection Setup Guide

## Import Collection

1. Open Postman
2. Click **Import** button
3. Select `Vero2-Technology-Service.postman_collection.json`
4. Click **Import**

## Environment Variables

The collection uses these variables that you should set:

### Collection Variables

1. **`base_url`** (Default: `http://localhost:3011`)
   - Base URL of the Technology Service

2. **`api_prefix`** (Default: `api/technical`)
   - API prefix for all routes

3. **`admin_token`** (Empty by default)
   - JWT Bearer token from SSO Service (admin role required)
   - Get this by logging in as admin via SSO Service

4. **`user_token`** (Empty by default)
   - JWT Bearer token from SSO Service (for user/agency/business routes)
   - Required for creating services
   - Get this by logging in as user/agency via SSO Service

5. **`service_id`** (Auto-populated)
   - Service ID from create service response
   - Automatically set when you create a service

6. **`category_id`** (Auto-populated)
   - Category ID from create category response
   - Automatically set when you create a category

## Getting Admin Token

### Step 1: Login via SSO Service

**Endpoint:** `POST http://localhost:3001/sso/auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### Step 2: Set Admin Token in Postman

1. Copy the `access_token` from the response
2. In Postman, click on the collection
3. Go to **Variables** tab
4. Set `admin_token` value to the token (without "Bearer " prefix)

## Testing Flow

### 1. Health Check
- **Request:** `GET /api/technical/health`
- **No authentication required**
- **Purpose:** Verify service is running

### 2. Get Admin Token
- See "Getting Admin Token" section above
- Set `admin_token` in collection variables

### 3. Create Category (Admin)
- **Request:** `POST /api/technical/services/categories`
- **Requires:** Admin Bearer token
- **Note:** Category ID will be auto-saved to `category_id` variable

### 4. Get User/Agency Token
- **Request:** `POST http://localhost:3001/sso/auth/login` (or appropriate endpoint)
- **Requires:** User/Agency credentials
- **Purpose:** Get JWT token for user/agency operations
- **Note:** Token will be used for `user_token` variable
- **Note:** Copy the `access_token` from response and set it in `user_token` collection variable

### 5. Create Service (User/Agency/Business)
- **Request:** `POST /api/technical/services`
- **Requires:** User/Agency Bearer token (`user_token`)
- **Note:** Based on document (vero.txt), users and agencies can create technology services
- **Note:** Service ID will be auto-saved to `service_id` variable
- **Note:** Category will be auto-created if it doesn't exist

### 6. View Services (Public)
- **Request:** `GET /api/technical/services`
- **No authentication required**
- **Filters:** Only visible services are returned

### 7. View Services (Admin)
- **Request:** `GET /api/technical/services/admin/list`
- **Requires:** Admin Bearer token
- **Filters:** All services including hidden ones

### 6. Update Service (Admin)
- **Request:** `PATCH /api/technical/services/{{service_id}}`
- **Requires:** Admin Bearer token
- **Note:** Uses `service_id` variable automatically

### 7. Toggle Visibility (Admin)
- **Request:** `PATCH /api/technical/services/{{service_id}}/visibility`
- **Requires:** Admin Bearer token
- **Body:** `{ "isVisible": false }`

### 8. Reorder Service (Admin)
- **Request:** `PATCH /api/technical/services/{{service_id}}/reorder`
- **Requires:** Admin Bearer token
- **Body:** `{ "direction": "up" }` or `{ "direction": "down" }`

### 9. Delete Service (Admin)
- **Request:** `DELETE /api/technical/services/{{service_id}}`
- **Requires:** Admin Bearer token

## Example Requests

### Create Service
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

### Update Service
```json
{
  "title": "Updated Web Development",
  "description": "Updated description",
  "tag": "fullstack",
  "isVisible": true
}
```

### Create Category
```json
{
  "name": "Web Development",
  "description": "Web development services",
  "displayOrder": 1,
  "isActive": true
}
```

## Testing Tips

1. **Start with Health Check** - Verify service is running
2. **Get Admin Token** - Login via SSO Service first
3. **Create Category** - Create categories before services
4. **Create Service** - Services auto-create categories if needed
5. **Test Public Routes** - Verify only visible services are returned
6. **Test Admin Routes** - Verify all CRUD operations work
7. **Test Reordering** - Create multiple services and test up/down
8. **Test Visibility** - Toggle visibility and verify public route behavior

## Error Responses

### 401 Unauthorized
```
Authorization header missing
```
**Solution:** Set `admin_token` variable with valid JWT token

### 403 Forbidden
```
Admin privileges required
```
**Solution:** Use admin token (not user token)

### 404 Not Found
```
Service with ID TECH-xxx-xxx not found
```
**Solution:** Check `service_id` variable is correct

### 400 Bad Request
```
Validation failed
```
**Solution:** Check request body format and required fields

### 409 Conflict
```
Category "Web Development" already exists
```
**Solution:** Use different category name or update existing

## Collection Structure

```
Technology Service Collection
├── Health Check
│   └── Health Check
├── Services - Public
│   ├── Get All Visible Services
│   └── Get Service by ID
├── Services - Admin
│   ├── Create Service
│   ├── Get All Services (Admin)
│   ├── Get Service by ID (Admin)
│   ├── Update Service
│   ├── Delete Service
│   ├── Toggle Service Visibility
│   ├── Reorder Service (Move Up)
│   └── Reorder Service (Move Down)
├── Categories - Public
│   └── Get All Active Categories
└── Categories - Admin
    ├── Create Category
    ├── Get All Categories (Admin)
    ├── Get Category by ID (Admin)
    ├── Update Category
    └── Delete Category
```

## Quick Start Checklist

- [ ] Import Postman collection
- [ ] Start Technology Service on port 3011
- [ ] Verify SSO Service is running on port 3001
- [ ] Get admin token from SSO Service
- [ ] Set `admin_token` in collection variables
- [ ] Test health check endpoint
- [ ] Create a category
- [ ] Create a service
- [ ] Test public routes (should not see hidden services)
- [ ] Test admin routes (should see all services)
- [ ] Test reordering and visibility toggle

