# Admin Database Table Fix

## Problem
The admin login endpoint was failing with error: `relation "admins" does not exist`

This occurred because the `admins` table was missing from the database despite migrations being marked as "run".

## Root Cause
The TypeORM migrations were executed but failed to create the `admins` table properly. The migration records showed as completed, but the actual table creation was skipped or failed.

## Solution Applied

### Step 1: Verified the Issue
- Checked that migrations were marked as run in the `migrations` table
- Confirmed the `admins` table was missing from `information_schema.tables`
- Verified the migration file contained the correct table creation SQL

### Step 2: Manually Created Missing Database Objects

#### Create the Enum Type
```sql
CREATE TYPE "public"."admins_role_enum" AS ENUM('super_admin', 'admin', 'sub_admin');
```

#### Create the Admins Table
```sql
CREATE TABLE "admins" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "email" character varying(255) NOT NULL,
    "password" character varying(255) NOT NULL,
    "fullName" character varying(255) NOT NULL,
    "role" "public"."admins_role_enum" NOT NULL DEFAULT 'admin',
    "permissions" jsonb,
    "lastLogin" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"),
    CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id")
);
```

### Step 3: Commands Used (via TypeORM CLI)

```bash
# Navigate to admin app directory
cd apps/admin

# Create enum type
npx typeorm-ts-node-commonjs query -d src/config/typeorm.config.ts "CREATE TYPE \"public\".\"admins_role_enum\" AS ENUM('super_admin', 'admin', 'sub_admin');"

# Create admins table
npx typeorm-ts-node-commonjs query -d src/config/typeorm.config.ts "CREATE TABLE \"admins\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"email\" character varying(255) NOT NULL, \"password\" character varying(255) NOT NULL, \"fullName\" character varying(255) NOT NULL, \"role\" \"public\".\"admins_role_enum\" NOT NULL DEFAULT 'admin', \"permissions\" jsonb, \"lastLogin\" TIMESTAMP WITH TIME ZONE, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT \"UQ_051db7d37d478a69a7432df1479\" UNIQUE (\"email\"), CONSTRAINT \"PK_e3b38270c97a854c48d2e80874e\" PRIMARY KEY (\"id\"))"

# Verify table exists
npx typeorm-ts-node-commonjs query -d src/config/typeorm.config.ts "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins';"
```

## Next Steps After Fix

### 1. Register First Admin User
Before you can login, you need to register an admin user using the bootstrap endpoint:

**Request:**
```
POST {{adminBaseUrl}}/auth/admin/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword",
  "fullName": "Admin User",
  "bootstrapSecret": "change-me-bootstrap"
}
```

**Note:** The `bootstrapSecret` value comes from your `.env` file (`ADMIN_BOOTSTRAP_SECRET`).

### 2. Login
Once an admin is registered, you can login:

**Request:**
```
POST {{adminBaseUrl}}/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

## For EC2/Production Deployment

Apply the same fix on your EC2 instance:

1. SSH into your EC2 instance
2. Navigate to your application directory
3. Run the same TypeORM CLI commands above
4. Register an admin user
5. Test the login endpoint

## Prevention

To avoid this issue in the future:

1. **Verify migrations run successfully**: After deployment, check that all expected tables exist
2. **Use proper error handling**: Ensure migration failures are caught and reported
3. **Consider database schema validation**: Add startup checks to verify required tables exist
4. **Update bootstrap secret**: Change the `ADMIN_BOOTSTRAP_SECRET` in production environments

## Files Modified/Checked

- `apps/admin/src/config/typeorm.config.ts` - Database configuration
- `apps/admin/src/migrations/1766489415108-InitialAdminSchema.ts` - Migration file
- `apps/admin/src/entities/admin.entity.ts` - Admin entity definition
- `apps/admin/src/auth/auth.service.ts` - Auth service logic
- `apps/admin/.env` - Environment configuration</content>
<parameter name="filePath">D:\deploy vero2 new\Backend\admin-database-fix.md