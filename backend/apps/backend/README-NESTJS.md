# Vero2 Backend - NestJS + MySQL

NestJS Backend with MySQL, TypeORM, and Redis for the Vero2 Platform.

## Architecture

- **NestJS**: Enterprise-grade Node.js framework with TypeScript
- **MySQL 8.0**: Primary relational database (via TypeORM)
- **Redis**: Caching and session management
- **TypeORM**: Object-Relational Mapping for MySQL

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- Redis 7+
- Docker & Docker Compose (optional)

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=vero2
```

4. Create MySQL database:
```sql
CREATE DATABASE vero2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## Database Migrations

Generate a migration:
```bash
npm run migration:generate -- -n MigrationName
```

Run migrations:
```bash
npm run migration:run
```

Revert last migration:
```bash
npm run migration:revert
```

## API Endpoints

### Authentication

- **POST** `/auth/user/register` - Register user, agency, or business account
- **POST** `/auth/user/verify-otp` - Verify OTP
- **POST** `/auth/user/login` - User login
- **POST** `/auth/user/forgot-password` - Request password reset
- **POST** `/auth/user/reset-password` - Reset password with OTP
- **POST** `/auth/admin/login` - Admin login
- **POST** `/auth/admin/create` - Create admin (requires admin auth)
- **GET** `/auth/me` - Get current user (protected)
- **POST** `/auth/send-otp` - Send OTP

## Account Types

The system supports four account types:

1. **User** - Standard user account
2. **Agency** - Agency account with business information (starts as 'pending')
3. **Business** - Business account (starts as 'active')
4. **Admin** - Admin accounts created with fixed email/password

## Project Structure

```
src/
├── entities/           # TypeORM entities (User, Admin)
├── auth/              # Authentication module
│   ├── dto/           # Data Transfer Objects
│   ├── guards/         # Auth guards
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── common/            # Shared utilities
│   └── utils/         # JWT, OTP utilities
├── config/            # Configuration files
├── redis/             # Redis module
└── main.ts            # Application entry point
```

## Technologies

- **NestJS**: Framework
- **TypeORM**: Database ORM
- **MySQL2**: MySQL driver
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT tokens
- **class-validator**: DTO validation
- **Redis**: Caching and OTP storage

## Environment Variables

See `.env.example` for all available environment variables.

