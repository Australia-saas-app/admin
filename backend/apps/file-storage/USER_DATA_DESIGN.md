# User Data Design - File Storage Service

## Design Decision: Only Store ownerId

### ✅ What We Store
- **ownerId** (string) - Reference to user ID from SSO/User Profile Service
- File metadata (filename, size, mimeType, etc.)
- File storage path and scan status

### ❌ What We DON'T Store
- User name
- User email
- User profile picture
- Any other user details

## Why This Design?

### 1. Microservices Principle
- **Single Source of Truth**: User details live in User Profile Service
- **No Data Duplication**: Avoids sync issues when user data changes
- **Service Independence**: File Storage Service doesn't depend on user data structure

### 2. Data Consistency
- If user changes email/name in User Profile Service, we don't need to update files
- No risk of stale user data in file records
- User Profile Service is the authoritative source

### 3. Scalability
- File Storage Service focuses on file operations only
- User details fetched on-demand when needed
- Reduces database size and complexity

## How to Get User Details

### Option 1: From JWT Token (Recommended)
The JWT token from SSO service contains user info:
```typescript
// In controller, after authentication
const userId = req.user.userId;
const email = req.user.email;
// Use this info directly from token
```

### Option 2: From User Profile Service
When you need full user profile:
```bash
GET http://user-profile-service:3005/api/user-profile/{ownerId}
Authorization: Bearer {jwt_token}
```

### Option 3: In Frontend
Fetch user details separately:
```typescript
// 1. Get file metadata (includes ownerId)
const file = await fetch(`/api/files/${fileId}`);

// 2. Get user details using ownerId
const user = await fetch(`/api/user-profile/${file.ownerId}`);
```

## Example: Displaying File with Owner Info

```typescript
// Backend Controller
@Get(':id')
async getFileWithOwner(@Param('id') id: string, @Req() req) {
  const file = await this.fileService.getOne(id);
  
  // Option 1: Use token data (already available)
  const ownerInfo = {
    userId: req.user.userId,
    email: req.user.email,
  };
  
  // Option 2: Fetch from User Profile Service
  // const ownerInfo = await this.userProfileService.getUser(file.ownerId);
  
  return {
    ...file,
    owner: ownerInfo, // Add owner info to response
  };
}
```

## Database Schema

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY,
  key VARCHAR NOT NULL,
  filename VARCHAR NOT NULL,
  mimeType VARCHAR NOT NULL,
  size BIGINT NOT NULL,
  ownerId VARCHAR,  -- Only ID, no user details
  folder VARCHAR,
  tags JSONB,
  scanStatus VARCHAR,
  scanResult JSONB,
  isDeleted BOOLEAN DEFAULT false,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## Summary

| Aspect | Decision | Reason |
|--------|----------|--------|
| **Store user details?** | ❌ No | Microservices principle, single source of truth |
| **Store ownerId?** | ✅ Yes | Needed for file ownership and filtering |
| **Get user details from?** | User Profile Service or JWT token | On-demand, no duplication |

---

**Note**: This design aligns with microservices best practices and ensures data consistency across services.

