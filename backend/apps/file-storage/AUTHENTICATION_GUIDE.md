# Authentication Guide - File Storage Service

## 🔐 Authentication Overview

The File Storage Service uses a **SimpleAuthGuard** that requires a Bearer token for most endpoints. However, the guard is currently a **placeholder** that doesn't verify JWT tokens - it only checks for the presence of a Bearer token.

## ✅ Health Endpoint (No Auth Required)

The `/api/files/health` endpoint **does NOT require authentication**. It's publicly accessible for health checks and monitoring.

```bash
GET http://localhost:3009/api/files/health
# No Authorization header needed
```

## 🔑 Token Requirements

### Current Implementation (Placeholder)

The `SimpleAuthGuard` currently:
- ✅ Checks if `Authorization` header exists
- ✅ Checks if it starts with `"Bearer "`
- ❌ **Does NOT verify JWT signature**
- ❌ **Does NOT check token expiration**
- ❌ **Does NOT validate token payload**

**This means ANY token that starts with "Bearer " will work!**

### Example (Works for Testing):
```bash
Authorization: Bearer test-token-123
Authorization: Bearer any-string-here
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 Production Token (SSO Service)

For production, you should use a **real JWT token** from your **SSO Service**:

### How to Get a Token:

1. **Login via SSO Service:**
   ```bash
   POST http://localhost:3001/sso/auth/login
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Response includes access token:**
   ```json
   {
     "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "...",
     "user": { ... }
   }
   ```

3. **Use the accessToken in File Storage requests:**
   ```bash
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### SSO Service Details:
- **URL**: `http://localhost:3001/sso` (or `http://sso:3001/sso` in Docker)
- **Token Format**: JWT (RS256 algorithm)
- **Issuer**: `http://localhost:3001/sso` or `http://sso:3001/sso`

## 📝 Postman Collection Setup

### 1. Set Collection Variables:
- `base_url`: `http://localhost:3009/api/files`
- `jwt_token`: Your JWT token from SSO service (or any string for testing)

### 2. For Testing (Quick Start):
Set `jwt_token` to any value:
```
jwt_token = "test-token-123"
```

### 3. For Production:
1. Login to SSO service
2. Copy the `accessToken` from response
3. Set `jwt_token` to the access token value

## ✅ JWT Verification Implementation

**Status: IMPLEMENTED** ✅

The `SimpleAuthGuard` now verifies JWT tokens from SSO Service using RS256 algorithm.

### Features:
- ✅ Verifies JWT token signature using SSO public key
- ✅ Checks token expiration
- ✅ Validates token issuer (SSO service)
- ✅ Handles Docker network vs localhost issuer differences
- ✅ Extracts user info (userId, email, role) from token
- ✅ Attaches user info to request object (`req.user`)
- ✅ Health endpoint remains public (no auth required)

### Configuration Required:

### Environment Variables:
```env
# Required: SSO Service Public Key (RS256)
# Get this from your SSO service
SSO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"

# Optional: SSO Service Issuer (default: http://localhost:3001/sso)
# In Docker, use: http://sso:3001/sso
SSO_ISSUER=http://localhost:3001/sso
```

### How It Works:

1. **Token Extraction**: Extracts Bearer token from Authorization header
2. **Signature Verification**: Verifies token signature using SSO public key (RS256)
3. **Issuer Validation**: Validates token is from SSO service
4. **Expiration Check**: Automatically checks if token is expired
5. **User Info Extraction**: Extracts userId, email, role from token payload
6. **Request Attachment**: Attaches user info to `req.user` for use in controllers

### Fallback Mode:

If `SSO_PUBLIC_KEY` is not configured, the guard will:
- Log a warning
- Accept any Bearer token (for development/testing)
- This allows backward compatibility during setup

### Using User Info in Controllers:

```typescript
@Get(':id')
async getFile(@Param('id') id: string, @Req() req) {
  // User info is available from JWT token
  const userId = req.user.userId;
  const email = req.user.email;
  const role = req.user.role;
  
  // Use this for authorization checks
  const file = await this.fileService.getOne(id);
  
  // Check ownership
  if (file.ownerId !== userId && role !== 'admin') {
    throw new ForbiddenException('Access denied');
  }
  
  return file;
}
```

## 📋 Summary

| Endpoint | Auth Required | Token Type |
|----------|---------------|------------|
| `GET /api/files/health` | ❌ No | None |
| All other endpoints | ✅ Yes | Bearer token (any string for now) |

## 🧪 Testing

### Test Health (No Auth):
```bash
curl http://localhost:3009/api/files/health
# Should return: {"status":"ok"}
```

### Test with Any Token:
```bash
curl -H "Authorization: Bearer test-token" \
  http://localhost:3009/api/files?ownerId=user-123
# Should work (for now)
```

### Test with Real JWT:
```bash
# 1. Get token from SSO
TOKEN=$(curl -X POST http://localhost:3001/sso/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.accessToken')

# 2. Use token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3009/api/files?ownerId=user-123
```

---

**Note**: The current implementation is a placeholder. For production, implement proper JWT verification as shown above.

