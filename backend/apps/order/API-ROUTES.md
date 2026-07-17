# Order Service API Routes

## Base URL
```
http://localhost:3003/api/orders
```

## Authentication
- **User/Agency Token**: `POST http://localhost:3001/sso/auth/user/login`
- **Admin Token**: `POST http://localhost:3001/sso/auth/admin/login` (aud=admin)

---

## 📋 Route Summary

### Public
- `GET /public/real-estate/list` — showcase of public real-estate orders (working/delivery)
- `GET /health` — service heartbeat

### User / Agency (JWT)
- `POST   /` — create order
- `GET    /` — list own orders (filters + analytics)
- `GET    /:orderCode` — single order
- `PATCH  /:orderCode` — edit pending order details
- `POST   /:orderCode/documents` — append documents (pending/working)
- (future) `/payments` webhooks will be proxied via payment service

### Admin (Admin JWT)
- `GET    /admin/list` — search, filter, analytics
- `GET    /admin/:orderCode` — detail (incl. status history)
- `PATCH  /admin/:orderCode` — edit pending order
- `PATCH  /admin/:orderCode/status` — move to next logical status
- `POST   /admin/:orderCode/profit` — update profit (waiting)
- `POST   /admin/:orderCode/files` — attach delivery files
- `POST   /admin/:orderCode/payments` — log payment event (updates totals)
- `GET    /admin/:orderCode/status-history` — timeline
- `DELETE /admin/:orderCode` — purge (cascades history/files)

---

## 🔐 Authentication Flow

### 1. End-user / agency token
```http
POST http://localhost:3001/sso/auth/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

### 2. Admin token
```http
POST http://localhost:3001/sso/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}
```

Use returned `access_token` as `Authorization: Bearer <token>`.

---

## 📝 Detailed Routes

### Health
```
GET /health
```
```json
{
  "status": "ok",
  "service": "order-service",
  "timestamp": "2025-11-24T10:00:00.000Z"
}
```

### Create Order
```
POST / (user JWT)
```
```json
{
  "orderType": "technology",
  "serviceName": "Full-stack MVP",
  "clientInfo": {
    "fullName": "Alex Doe",
    "email": "alex@example.com",
    "phone": "+1-202-555-0112",
    "nationality": "US",
    "permanentAddress": {
      "country": "United States",
      "state": "CA",
      "city": "San Francisco",
      "zipCode": "94105",
      "address": "1 Market St"
    }
  },
  "pricing": {
    "totalAmount": 25000,
    "currency": "USD"
  },
  "orderDetails": {
    "projectType": "Company",
    "priorityLevel": "High",
    "expectedEndDate": "2025-12-31"
  },
  "documents": [
    {
      "fileName": "requirements.pdf",
      "fileUrl": "https://storage/req.pdf",
      "fileType": "pdf"
    }
  ]
}
```

**Response**
```json
{
  "orderCode": "ORDER000123",
  "status": "pending",
  "orderType": "technology",
  "pricing": {
    "totalAmount": 25000,
    "paidAmount": 0,
    "dueAmount": 25000,
    "currency": "USD"
  },
  "createdAt": "2025-11-24T10:15:00.000Z"
}
```

### List Orders (Requester)
```
GET /?status=pending,working&orderType=technology&search=MVP&page=1&limit=10&includeAnalytics=true
```
Returns paginated data plus aggregated counts/amounts per status when `includeAnalytics=true`.

### Append Documents
```
POST /:orderCode/documents
{
  "documents": [
    { "fileName": "contract.pdf", "fileUrl": "...", "fileType": "pdf" }
  ]
}
```

### Admin Status Change
```
PATCH /admin/:orderCode/status
{
  "status": "working",
  "reason": "Developer team assigned"
}
```

### Admin Payment Record
```
POST /admin/:orderCode/payments
{
  "amount": 10000,
  "currency": "USD",
  "method": "stripe",
  "transactionId": "pi_3Pxxxx",
  "status": "succeeded",
  "paidAt": "2025-11-24T12:00:00.000Z"
}
```

Automatically pushes payment history entry, increments `paidAmount`, re-computes `dueAmount`, and promotes `payment → waiting` when threshold met.

---

## 🧮 Status Definitions
- `pending` – user can edit order data.
- `payment` – awaiting first payment (set by admin/payment service).
- `waiting` – funds received, admin can add profit.
- `working` – active fulfillment, chat + order documents allowed.
- `stopped` – paused work (view only).
- `complete` – deliverables uploaded, awaiting final settlement.
- `delivery` – auto when `complete` + `dueAmount = 0`; download unlocked.
- `refund` / `cancel` – terminal states.

---

## ⚠️ Business Rules Snapshot
- Requesters can only edit **pending** orders.
- Documents can be attached while **pending** or **working**.
- Profit can be added only in **waiting** status.
- Admin files require **working / complete / delivery**.
- Payment events may shift status and will always create history entries.
- Final statuses (`delivery`, `refund`, `cancel`) cannot be mutated.

---

## Postman
Import `Vero2-Order-Service.postman_collection.json` for ready-made requests.

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




