# Blog Management API Routes

## Overview
Complete blog management functionality for the Admin Service. All routes require admin authentication via JWT token.

## Base URL
`/menu/blogs`

## Authentication
All endpoints require:
- Header: `Authorization: Bearer <JWT_TOKEN>`
- Admin role: `admin`, `sub_admin`, or `super_admin`

---

## API Endpoints

### 1. Get All Blogs
**GET** `/menu/blogs`

Get paginated list of blogs with optional search functionality.

**Query Parameters:**
- `page` (optional, number): Page number (default: 1)
- `limit` (optional, number): Items per page (default: 10)
- `search` (optional, string): Search blogs by title, description, or tag

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "blogId": "BLOG1234567890ABC",
        "photo": "https://example.com/photo.jpg",
        "title": "Blog Title",
        "tag": "nestjs, tutorial",
        "description": "Blog description...",
        "isVisible": true,
        "displayOrder": 0,
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
}
```

**Example:**
```bash
GET /menu/blogs?page=1&limit=10&search=nestjs
```

---

### 2. Create Blog
**POST** `/menu/blogs`

Create a new blog post.

**Request Body:**
```json
{
  "photo": "https://example.com/blog-photo.jpg",
  "title": "Getting Started with NestJS",
  "tag": "nestjs, backend, tutorial",
  "description": "This is a comprehensive guide..."
}
```

**Validation:**
- `title`: Required, string, 1-200 characters
- `photo`: Optional, string (URL)
- `tag`: Optional, string, max 100 characters
- `description`: Optional, string, max 10000 characters

**Response:**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "blogId": "BLOG1234567890ABC",
    "photo": "https://example.com/blog-photo.jpg",
    "title": "Getting Started with NestJS",
    "tag": "nestjs, backend, tutorial",
    "description": "This is a comprehensive guide...",
    "isVisible": true,
    "displayOrder": 0,
    "createdBy": "admin@example.com",
    "updatedBy": "admin@example.com"
  }
}
```

---

### 3. Update Blog
**PATCH** `/menu/blogs/:blogId`

Update an existing blog post.

**Path Parameters:**
- `blogId` (string): Blog ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description...",
  "tag": "updated, tags"
}
```

All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "blogId": "BLOG1234567890ABC",
    "title": "Updated Title",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Blog with ID BLOG1234567890ABC not found"
}
```

---

### 4. Delete Blog
**DELETE** `/menu/blogs/:blogId`

Permanently delete a blog post.

**Path Parameters:**
- `blogId` (string): Blog ID

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "data": {
    "blogId": "BLOG1234567890ABC"
  }
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Blog with ID BLOG1234567890ABC not found"
}
```

---

### 5. Toggle Blog Visibility
**PATCH** `/menu/blogs/:blogId/visibility`

Toggle the visibility status of a blog. When `isVisible` is `false`, the blog will not be shown on the user and agency website.

**Path Parameters:**
- `blogId` (string): Blog ID

**Response:**
```json
{
  "success": true,
  "message": "Blog visibility toggled successfully",
  "data": {
    "blogId": "BLOG1234567890ABC",
    "isVisible": false
  }
}
```

---

### 6. Reorder Blogs
**POST** `/menu/blogs/reorder`

Reorder multiple blogs by updating their display order.

**Request Body:**
```json
[
  {
    "id": "BLOG1234567890ABC",
    "newPosition": 0
  },
  {
    "id": "BLOG0987654321XYZ",
    "newPosition": 1
  }
]
```

**Response:**
```json
{
  "success": true,
  "message": "Blogs reordered successfully",
  "data": {
    "reordered": [
      {
        "id": "BLOG1234567890ABC",
        "newPosition": 0
      },
      {
        "id": "BLOG0987654321XYZ",
        "newPosition": 1
      }
    ]
  }
}
```

---

## Database Schema

**Collection:** `blogs`

**Fields:**
- `blogId` (string, unique, indexed): Auto-generated blog ID
- `photo` (string): Blog photo URL
- `title` (string, required, indexed): Blog title
- `tag` (string): Blog tags
- `description` (string, required): Blog content/description
- `isVisible` (boolean, default: true, indexed): Visibility status
- `displayOrder` (number, default: 0, indexed): Display order for sorting
- `createdBy` (string, required): Admin ID or email who created the blog
- `updatedBy` (string): Admin ID or email who last updated the blog
- `createdAt` (Date): Creation timestamp
- `updatedAt` (Date): Last update timestamp

**Indexes:**
- Text index on `title`, `description`, and `tag` for search
- Index on `isVisible` and `displayOrder` for filtering and sorting
- Index on `createdAt` for date-based queries
- Unique index on `blogId`

---

## Features Implemented

✅ **View All Blogs** - Paginated list with search
✅ **Search Blogs** - Full-text search by title, description, or tag
✅ **Create Blog** - Create new blog posts with photo, title, tag, and description
✅ **Update Blog** - Update existing blog posts
✅ **Delete Blog** - Permanently delete blog posts
✅ **Toggle Visibility** - Show/hide blogs from user and agency websites
✅ **Reorder Blogs** - Change display order using Up/Down arrows in admin panel

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (blog doesn't exist)
- `500` - Internal Server Error

---

## Notes

- Blog IDs are auto-generated in format: `BLOG{timestamp}{random}`
- Display order starts at 0 and increments for each new blog
- When visibility is set to `false`, blogs are hidden from public-facing websites
- Search uses MongoDB text search on title, description, and tag fields
- All operations are logged with admin information for audit purposes

