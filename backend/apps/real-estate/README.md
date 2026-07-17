# Real Estate Service

NestJS microservice for managing real estate properties and categories.

## Port
- Default: `3011`
- Configure via `PORT` environment variable

## Features

### Properties Management
- Create, read, update, delete real estate properties
- Toggle visibility (show/hide from public)
- Reorder properties (up/down arrows)
- Search by property type and price/budget
- Filter by property status (Rent, Buy, Sale, Mortgage)
- Pagination support
- Support for multiple property types:
  - Residential: Houses, Flats, Apartments, Townhouses, Villas, Condominiums, Multi-Family Units
  - Commercial: Office Buildings, Stores, Shopping Malls, Hotel, Resorts, Co-working Spaces
  - Industrial: Factories, Warehouses, Distribution Centers, etc.
  - Land: Raw Land, Development Land, Agricultural Land, etc.

### Property Features
- Multiple photos support
- Size/square feet
- Price/budget
- Features list (multiple)
- Residential-specific fields: Beds, Bathroom, Kitchen
- Property status: Rent, Buy, Sale, Mortgage
- Current status: Vacant, Currently Rented, Under Construction, Ready-to-Move

### Categories Management
- Create, read, update, delete real estate categories
- Auto-create categories when property is created
- Prevent deletion if category is in use

## API Endpoints

### Public Routes

#### Properties
- `GET /api/real-estate/properties` - List all visible properties
- `GET /api/real-estate/properties/:propertyId` - Get property details
- `GET /api/real-estate/properties/categories/list` - List all active categories

#### Health
- `GET /api/real-estate/health` - Health check

### Admin Routes (Requires JWT Bearer Token)

#### Properties
- `POST /api/real-estate/properties` - Create property
- `GET /api/real-estate/properties/admin/list` - List all properties (including hidden)
- `GET /api/real-estate/properties/admin/:propertyId` - Get property (any visibility)
- `PATCH /api/real-estate/properties/:propertyId` - Update property
- `DELETE /api/real-estate/properties/:propertyId` - Delete property
- `PATCH /api/real-estate/properties/:propertyId/visibility` - Toggle visibility
- `PATCH /api/real-estate/properties/:propertyId/reorder` - Reorder property

#### Categories
- `POST /api/real-estate/properties/categories` - Create category
- `GET /api/real-estate/properties/admin/categories/list` - List all categories
- `GET /api/real-estate/properties/admin/categories/:categoryId` - Get category
- `PATCH /api/real-estate/properties/categories/:categoryId` - Update category
- `DELETE /api/real-estate/properties/categories/:categoryId` - Delete category

### User/Agency Routes (Requires JWT Bearer Token)

#### Properties
- `POST /api/real-estate/properties` - Create property (User/Agency/Business)
- `POST /api/real-estate/properties/user` - Create property (User only)
- `POST /api/real-estate/properties/agent` - Create property (Agent/Agency only)
- `PATCH /api/real-estate/properties/user/:propertyId` - Update property (User owns property)
- `PATCH /api/real-estate/properties/agent/:propertyId` - Update property (Agent/Agency owns property)
- `DELETE /api/real-estate/properties/user/:propertyId` - Delete property (User owns property)
- `DELETE /api/real-estate/properties/agent/:propertyId` - Delete property (Agent/Agency owns property)

## Query Parameters

### Properties List
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `propertyType` - Filter by property type
- `propertyStatus` - Filter by property status (Rent, Buy, Sale, Mortgage)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `isVisible` - Filter by visibility (admin only)
- `category` - Filter by category name

### Categories List
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `isActive` - Filter by active status

## Project Structure

```
src/
├── real-estate/
│   ├── entities/
│   │   ├── real-estate-property.entity.ts
│   │   └── real-estate-category.entity.ts
│   ├── dto/
│   │   ├── create-property.dto.ts
│   │   ├── update-property.dto.ts
│   │   ├── create-category.dto.ts
│   │   ├── update-category.dto.ts
│   │   └── query-params.dto.ts
│   ├── services/
│   │   ├── real-estate-property.service.ts
│   │   └── real-estate-category.service.ts
│   ├── real-estate.controller.ts
│   └── real-estate.module.ts
├── common/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── admin-auth.guard.ts
│   └── interfaces/
│       └── request.interface.ts
├── health/
│   ├── health.controller.ts
│   └── health.module.ts
├── app.module.ts
└── main.ts
```

## Notes

- Property IDs are auto-generated with prefix `RE-`
- Category IDs are auto-generated with prefix `RE-CAT-`
- Service type is always `real-estate`
- Categories are automatically created when referenced in property creation
- Categories cannot be deleted if they have associated properties
- Properties support multiple photos as JSON array
- Residential properties can include beds, bathroom, and kitchen fields
- Search supports property type and price range filtering

## Environment Variables

- `PORT` - Service port (default: 3011)
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: vero2)
- `SSO_PUBLIC_KEY` - SSO service public key for JWT verification
- `SSO_ISSUER` - SSO service issuer URL (default: http://localhost:3001/sso)
- `RATE_LIMIT_TTL` - Rate limit time window in seconds (default: 60)
- `RATE_LIMIT_MAX` - Maximum requests per window (default: 100)
- `NODE_ENV` - Environment (development/production)


