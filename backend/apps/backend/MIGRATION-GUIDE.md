# Migration Guide: Express + MongoDB to NestJS + MySQL

This document outlines the migration from Express.js + MongoDB/Mongoose to NestJS + MySQL/TypeORM.

## Key Changes

### 1. Framework Change
- **From**: Express.js (JavaScript)
- **To**: NestJS (TypeScript)

### 2. Database Change
- **From**: MongoDB with Mongoose
- **To**: MySQL 8.0 with TypeORM

### 3. Architecture Changes

#### Old Structure (Express)
```
backend/
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── middleware/      # Express middleware
├── utils/           # Utility functions
└── server.js        # Express app
```

#### New Structure (NestJS)
```
backend/
├── src/
│   ├── entities/       # TypeORM entities (replaces Mongoose models)
│   ├── auth/            # Auth module (replaces routes)
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── guards/      # Auth guards (replaces middleware)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── common/          # Shared utilities
│   ├── config/          # Configuration
│   ├── redis/           # Redis module
│   └── main.ts          # NestJS bootstrap (replaces server.js)
└── package.json
```

## Entity Changes

### User Model → User Entity

**Mongoose (Old)**:
```javascript
const UserSchema = new mongoose.Schema({
  userId: String,
  email: String,
  password: String,
  // ...
});
```

**TypeORM (New)**:
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  // ...
}
```

### Key Differences

1. **Indexes**: Defined using `@Index()` decorator instead of schema options
2. **Enums**: TypeScript enums instead of string literals
3. **JSON Fields**: Agency and Business info stored as JSON columns in MySQL
4. **Relationships**: Use TypeORM decorators (`@OneToMany`, `@ManyToOne`, etc.)

## API Route Changes

### Express Routes (Old)
```javascript
router.post('/user/register', async (req, res) => {
  // Implementation
});
```

### NestJS Controller (New)
```typescript
@Controller('auth')
export class AuthController {
  @Post('user/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
```

## Query Changes

### Mongoose (Old)
```javascript
const user = await User.findOne({ 
  $or: [{ email }, { phone }] 
});
```

### TypeORM (New)
```typescript
const whereConditions: any[] = [];
if (email) whereConditions.push({ email });
if (phone) whereConditions.push({ phone });

const user = whereConditions.length > 0
  ? await this.userRepository.findOne({ where: whereConditions })
  : null;
```

## Validation Changes

### Old (Express with manual validation)
```javascript
if (!fullName || !password) {
  return res.status(400).json({ error: 'Missing fields' });
}
```

### New (NestJS with DTOs)
```typescript
export class RegisterDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

## Database Setup

### MySQL Configuration

Create database:
```sql
CREATE DATABASE vero2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=vero2
```

### Migrations

NestJS uses TypeORM migrations instead of Mongoose schema syncing:

```bash
# Generate migration
npm run migration:generate -- -n InitialMigration

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Password Hashing

**Old (Mongoose hook)**:
```javascript
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

**New (Service layer)**:
```typescript
// In AuthService
const hashedPassword = await bcrypt.hash(newPassword, 10);
user.password = hashedPassword;
await this.userRepository.save(user);
```

## Redis Connection

**Old (Express)**:
```javascript
const redisClient = redis.createClient({...});
module.exports.redisClient = redisClient;
```

**New (NestJS Module)**:
```typescript
@Global()
@Module({
  providers: [{
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
      const client = redis.createClient({...});
      await client.connect();
      return client;
    }
  }]
})
export class RedisModule {}
```

## Running the Application

### Old
```bash
npm start  # node server.js
```

### New
```bash
npm run start:dev  # nest start --watch
```

## Testing

All endpoints remain the same, but:
- Request/response structure is unchanged
- Validation errors now use NestJS exception format
- Error responses may have slightly different structure

## Next Steps

1. Run database migrations to create tables
2. Migrate existing MongoDB data to MySQL (if needed)
3. Update frontend API calls if response format changed
4. Test all endpoints
5. Update deployment scripts

