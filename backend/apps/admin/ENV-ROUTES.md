# Environment
- ADMIN_PORT=3007
- ADMIN_DB_USER=vero2_admin_app
- ADMIN_DB_PASSWORD=change-me-admin
- ADMIN_DB_NAME=vero2_admin
- ADMIN_NODE_ENV=development
- ADMIN_RATE_LIMIT_MAX=500
- ADMIN_BOOTSTRAP_SECRET=change-me-bootstrap

# Routes
- Base: `/menu/blogs` (admin JWT required)
- GET `/menu/blogs` — list blogs (pagination, search)
- POST `/menu/blogs` — create blog
- PATCH `/menu/blogs/:blogId` — update blog
- DELETE `/menu/blogs/:blogId` — delete blog
- PATCH `/menu/blogs/:blogId/visibility` — toggle visibility
- POST `/menu/blogs/reorder` — reorder blogs

