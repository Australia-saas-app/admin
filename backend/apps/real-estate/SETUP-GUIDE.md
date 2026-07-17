# Real Estate Service - Setup Guide

## 📋 Overview

The Real Estate Service is a NestJS microservice for managing real estate properties and categories. It runs on port **3011** (mapped to **3013** for Docker).

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL database
- SSO Service running (for authentication)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file has been created with default values. Update it if needed:
```bash
# Edit .env file
PORT=3011
DB_HOST=vero2-postgres
DB_PORT=5432
DB_USERNAME=vero2_backend_app
DB_PASSWORD=your_password
DB_NAME=vero2_backend
SSO_PUBLIC_KEY=your_sso_public_key
SSO_ISSUER=http://sso:3001/sso
```

### 3. Run with Docker (Recommended)
```powershell
# Windows PowerShell
.\docker-run.ps1

# Linux/Mac
chmod +x docker-run.sh
./docker-run.sh
```

### 4. Run Locally (Development)
```bash
npm run start:dev
```

## 📡 API Endpoints

### Base URL
- **Docker**: `http://localhost:3013`
- **Local**: `http://localhost:3011`
- **API Prefix**: `/api/real-estate`

### Public Endpoints
- `GET /api/real-estate/health` - Health check
- `GET /api/real-estate/properties` - List visible properties
- `GET /api/real-estate/properties/:propertyId` - Get property details
- `GET /api/real-estate/properties/categories/list` - List active categories

### Admin Endpoints (Requires Admin Token)
- `GET /api/real-estate/properties/admin/list` - List all properties
- `POST /api/real-estate/properties` - Create property
- `PATCH /api/real-estate/properties/:propertyId` - Update property
- `DELETE /api/real-estate/properties/:propertyId` - Delete property
- `PATCH /api/real-estate/properties/:propertyId/visibility` - Toggle visibility
- `PATCH /api/real-estate/properties/:propertyId/reorder` - Reorder property

### User/Agency Endpoints (Requires User Token)
- `POST /api/real-estate/properties` - Create property
- `POST /api/real-estate/properties/user` - Create property (user only)
- `POST /api/real-estate/properties/agent` - Create property (agency only)
- `PATCH /api/real-estate/properties/user/:propertyId` - Update property (user owns)
- `PATCH /api/real-estate/properties/agent/:propertyId` - Update property (agency owns)
- `DELETE /api/real-estate/properties/user/:propertyId` - Delete property (user owns)
- `DELETE /api/real-estate/properties/agent/:propertyId` - Delete property (agency owns)

## 📦 Postman Collection

Import the Postman collection: `Vero2-Real-Estate-Service.postman_collection.json`

### Collection Variables
- `base_url`: `http://localhost:3013` (or your service URL)
- `api_prefix`: `api/real-estate`
- `admin_token`: JWT token from SSO admin login
- `user_token`: JWT token from SSO user login
- `property_id`: Auto-set after creating a property
- `category_id`: Auto-set after creating a category

### Getting Tokens

1. **Admin Token**: 
   ```
   POST http://localhost:3001/sso/auth/admin/login
   Body: { "email": "admin@example.com", "password": "password" }
   ```

2. **User Token**:
   ```
   POST http://localhost:3001/sso/auth/user/login
   Body: { "email": "user@example.com", "password": "password" }
   ```

## 🏗️ Property Types

### Residential
- Houses, Flats, Apartments, Townhouses, Villas, Condominiums, Multi-Family Units
- **Additional Fields**: beds, bathroom, kitchen

### Commercial
- Office Buildings, Stores, Shopping Malls, Hotel, Resorts, Co-working Spaces
- **Additional Fields**: sizeSquareFeet

### Industrial
- Factories, Warehouses, Distribution Centers, Logistics Sites, Cold Storage, etc.
- **Additional Fields**: sizeSquareFeet

### Land
- Raw Land, Development Land, Agricultural Land, Land Plots, etc.
- **Additional Fields**: sizeSquareFeet

## 🔍 Query Parameters

### Properties List
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `propertyType` - Filter by property type
- `propertyStatus` - Filter by status (Rent, Buy, Sale, Mortgage)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `category` - Filter by category name
- `isVisible` - Filter by visibility (admin only)

### Example Queries
```
# Get properties by type
GET /api/real-estate/properties?propertyType=Houses

# Get properties by price range
GET /api/real-estate/properties?minPrice=100000&maxPrice=500000

# Get properties by status
GET /api/real-estate/properties?propertyStatus=Rent

# Combined filters
GET /api/real-estate/properties?propertyType=Houses&propertyStatus=Sale&minPrice=200000&maxPrice=600000
```

## 📝 Example Property Creation

```json
{
  "propertyType": "Houses",
  "propertyStatus": "Sale",
  "currentStatus": "Ready-to-Move",
  "photos": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "description": "Beautiful 3-bedroom house in prime location",
  "sizeSquareFeet": 2000,
  "price": 500000,
  "features": [
    "Air conditioning",
    "Parking",
    "Gym",
    "Pool"
  ],
  "beds": 3,
  "bathroom": 2,
  "kitchen": 1,
  "category": "Residential",
  "isVisible": true
}
```

## 🐳 Docker Commands

See [DOCKER-COMMANDS.md](./DOCKER-COMMANDS.md) for detailed Docker commands.

## 📚 API Documentation

Once the service is running, access Swagger documentation at:
- **Docker**: `http://localhost:3013/api/real-estate/docs`
- **Local**: `http://localhost:3011/api/real-estate/docs`

## 🔧 Troubleshooting

### Service won't start
1. Check if database is running and accessible
2. Verify SSO service is running
3. Check network connectivity: `docker network ls`
4. View logs: `docker-compose logs real-estate-service`

### Authentication errors
1. Verify SSO_PUBLIC_KEY is correct
2. Check SSO_ISSUER matches SSO service
3. Ensure tokens are valid and not expired

### Database connection errors
1. Verify database credentials in `.env`
2. Check database is accessible from container
3. Ensure database exists: `DB_NAME=vero2_backend`

## 📞 Support

For issues or questions, check:
- Service logs: `docker-compose logs real-estate-service`
- Health endpoint: `http://localhost:3013/api/real-estate/health`
- API documentation: `http://localhost:3013/api/real-estate/docs`


