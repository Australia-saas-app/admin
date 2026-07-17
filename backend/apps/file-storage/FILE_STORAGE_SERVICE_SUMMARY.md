# File Storage Service - Complete Summary

## 📍 Service Overview
**Port:** 3009  
**Base URL:** `http://localhost:3009/api/files`  
**Storage Location:** **Local filesystem** (`/app/storage` in Docker, configurable via `LOCAL_STORAGE_PATH`)  
**Storage Type:** Node.js `fs/promises` - All files stored on server's local filesystem

---

## 💾 Where Files Are Stored

### Storage Implementation
✅ **Fully migrated to local filesystem storage** - All Storj/S3 references have been removed.

1. **Local Filesystem Storage:**
   - Path: `/app/storage` (Docker container) or `LOCAL_STORAGE_PATH` env variable
   - Files stored on the server's local filesystem using Node.js `fs/promises`
   - Organized by folder structure: `{storagePath}/{folder}/{uuid}-{filename}`
   - Directory structure created automatically on service startup
   - All file operations (upload, download, delete) use local filesystem

2. **Database (PostgreSQL):**
   - File metadata stored in `files` table
   - Stores: `id`, `key` (file path), `filename`, `mimeType`, `size`, `ownerId`, `folder`, `tags`, `scanStatus`, `scanResult`, `isDeleted`
   - The `key` field contains the relative path from storage root (e.g., `documents/uuid-filename.pdf`)

---

## 🛣️ All Routes & Their Purposes

### **Upload Routes**

#### 1. `POST /api/files/presign/upload`
**Purpose:** Request a presigned upload URL (2-step upload process - Step 1)

**When to use:**
- When you want to upload large files
- When you need to validate file metadata before upload
- When you want to reserve storage space before actual upload

**Request Body:**
```json
{
  "filename": "document.pdf",
  "mimeType": "application/pdf",
  "size": 1024000,
  "ownerId": "user-123",
  "folder": "documents"
}
```

**Response:**
```json
{
  "id": "file-uuid",
  "key": "documents/uuid-document.pdf",
  "uploadUrl": "http://localhost:3009/api/files/{id}/upload",
  "expiresIn": 3600
}
```

**What it does:**
- Validates MIME type and filename
- Creates a database record with `scanStatus: 'pending'`
- Returns an upload URL and file ID

---

#### 2. `POST /api/files/{id}/upload`
**Purpose:** Complete the presigned upload by actually uploading the file (2-step upload process - Step 2)

**When to use:**
- After calling `presign/upload`
- To upload the actual file content

**Request:** Multipart form data with `file` field

**Response:**
```json
{
  "id": "file-uuid",
  "key": "documents/uuid-document.pdf"
}
```

**What it does:**
- Validates file (type, size, security, antivirus)
- Updates database record with actual file metadata
- Saves file to local filesystem
- Updates `scanStatus` to `'clean'` or `'infected'`

---

#### 3. `POST /api/files` (Direct Upload)
**Purpose:** Upload a file directly in one step (simpler alternative)

**When to use:**
- For smaller files
- When you don't need the 2-step process
- For simpler use cases

**Request:** Multipart form data
```
file: [file]
ownerId: "user-123"
folder: "documents"
tags: ["tag1", "tag2"]
```

**Response:**
```json
{
  "id": "file-uuid",
  "key": "documents/uuid-filename.pdf"
}
```

**What it does:**
- Validates file immediately
- Creates database record
- Saves file to storage
- Returns file ID

---

### **Download Routes**

#### 4. `POST /api/files/presign/download`
**Purpose:** Request a presigned download URL (temporary download link)

**When to use:**
- When you want to generate a temporary download link
- For secure, time-limited file access
- When you don't want to expose direct file URLs

**Request Body:**
```json
{
  "key": "documents/uuid-document.pdf"
}
```

**Response:**
```json
{
  "id": "file-uuid",
  "key": "documents/uuid-document.pdf",
  "downloadUrl": "http://localhost:3009/api/files/{id}/download",
  "expiresIn": 3600
}
```

---

#### 5. `GET /api/files/{id}/download`
**Purpose:** Download a file directly by ID

**When to use:**
- Direct file download
- When you have the file ID
- For streaming large files

**Response:** File stream with appropriate headers

---

### **File Management Routes**

#### 6. `GET /api/files`
**Purpose:** List all files with filtering and pagination

**Query Parameters:**
- `ownerId`: Filter by owner
- `folder`: Filter by folder
- `tag`: Filter by tag
- `search`: Search by filename
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "items": [...],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

---

#### 7. `GET /api/files/{id}`
**Purpose:** Get file metadata by ID

**Response:**
```json
{
  "id": "file-uuid",
  "key": "documents/uuid-document.pdf",
  "filename": "document.pdf",
  "mimeType": "application/pdf",
  "size": 1024000,
  "ownerId": "user-123",
  "folder": "documents",
  "tags": [],
  "scanStatus": "clean",
  "scanResult": {...},
  "isDeleted": false,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

#### 8. `PATCH /api/files/{id}/metadata`
**Purpose:** Update file metadata (filename, folder, tags, deletion status)

**Request Body:**
```json
{
  "filename": "new-name.pdf",
  "folder": "new-folder",
  "tags": ["tag1", "tag2"],
  "isDeleted": false
}
```

---

#### 9. `DELETE /api/files/{id}`
**Purpose:** Delete a file (soft delete by default)

**Query Parameters:**
- `hard=true`: Permanently delete file from storage

**Response:**
```json
{
  "id": "file-uuid"
}
```

---

#### 10. `POST /api/files/{id}/restore`
**Purpose:** Restore a soft-deleted file

---

### **Security & Scanning Routes**

#### 11. `POST /api/files/{id}/scan`
**Purpose:** Update antivirus scan status (typically used by external scanning service)

**Request Body:**
```json
{
  "status": "clean" | "infected" | "error",
  "details": {...}
}
```

---

#### 12. `GET /api/files/{id}/scan`
**Purpose:** Get antivirus scan status and results

**Response:**
```json
{
  "id": "file-uuid",
  "status": "clean",
  "result": {
    "scanned": true,
    "timestamp": "2025-01-01T00:00:00Z"
  }
}
```

---

## 🔍 How File Scanning Works

### **Automatic Scanning During Upload**

Files are automatically scanned when uploaded through:
- `POST /api/files` (Direct Upload)
- `POST /api/files/{id}/upload` (Presigned Upload)

**Scanning Process:**

1. **Automatic Scan on Upload:**
   - When `ENABLE_ANTIVIRUS_SCAN=true` (default), files are scanned automatically during upload
   - Scanning happens **before** the file is saved to storage
   - If malicious content is detected, the upload is **rejected** immediately

2. **What Gets Scanned:**

   **a) Suspicious Pattern Detection:**
   - Scans text-based files (< 1MB) for malicious patterns:
     - `<script>` tags (XSS attempts)
     - `javascript:` URLs
     - Event handlers: `onerror=`, `onload=`
     - Dangerous functions: `eval()`, `exec()`, `system()`
   - Only scans first 10KB of text files for performance

   **b) Executable File Detection:**
   - Blocks executable files by detecting file signatures:
     - **Windows PE** files (`.exe`, `.dll`) - Detects `MZ` header
     - **Linux ELF** files - Detects `ELF` header
     - **Java class** files - Detects `CAFEBABE` header
   - Executables are **always rejected** regardless of extension

3. **Scan Status Values:**
   - `pending` - File record created, waiting for upload/scan
   - `clean` - File scanned and passed all checks ✅
   - `infected` - Malicious content detected ❌
   - `error` - Scan failed or encountered error
   - `skipped` - Scan was skipped (if disabled)

4. **Scan Results:**
   - Stored in database `scanResult` field
   - Contains: `{ scanned: true, timestamp: "..." }` for clean files
   - Contains: `{ error: "..." }` for errors

### **Manual Scan Status Update**

You can manually update scan status using:
- `POST /api/files/{id}/scan` - Update scan status (for external scanners)

**Use Case:** If you integrate with ClamAV or another external antivirus service, they can update the scan status after scanning the file.

### **Current Implementation: Basic Content Analysis**

**What it does:**
- ✅ Pattern-based detection (suspicious code patterns)
- ✅ Executable file blocking (PE, ELF, Java class files)
- ✅ Real-time scanning during upload
- ✅ Automatic rejection of malicious files

**What it doesn't do (yet):**
- ❌ Full virus signature database scanning
- ❌ Heuristic malware detection
- ❌ Advanced threat analysis

### **Production Recommendation: ClamAV Integration**

For production environments, integrate with **ClamAV** daemon for comprehensive virus scanning:

```typescript
// Example ClamAV integration (commented in code)
const ClamScan = require('clamscan');
const clamscan = await new ClamScan().init();
const { isInfected, viruses } = await clamscan.isInfected(buffer);
if (isInfected) {
  throw new BadRequestException(`File is infected: ${viruses.join(', ')}`);
}
```

**To enable ClamAV:**
1. Install ClamAV daemon: `docker run -d --name clamav -p 3310:3310 clamav/clamav:latest`
2. Uncomment ClamAV code in `file-validation.service.ts`
3. Install `clamscan` npm package: `npm install clamscan`
4. Files will be scanned with full virus database

### **Configuration**

```bash
# Enable/disable automatic scanning
ENABLE_ANTIVIRUS_SCAN=true  # Set to 'false' to disable
```

**Note:** Even with `ENABLE_ANTIVIRUS_SCAN=false`, basic security checks (file type, size, extension) still apply.

---

### **File Sharing Routes**

#### 13. `POST /api/files/{id}/share`
**Purpose:** Create a shareable link for a file

**Request Body:**
```json
{
  "ownerId": "user-123",
  "permission": "read" | "write",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "id": "share-uuid",
  "token": "share-token",
  "permission": "read",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

---

#### 14. `GET /api/files/{id}/shares`
**Purpose:** List all shares for a file

---

#### 15. `DELETE /api/files/{id}/share/{shareId}`
**Purpose:** Delete a file share

---

## 🤔 Why Presigned Upload/Download Instead of Simple Upload?

### **Presigned Upload Benefits:**

1. **Large File Support:**
   - Better for files > 10MB
   - Validates metadata before accepting file upload
   - Reduces server load by validating upfront

2. **Two-Step Validation:**
   - Step 1: Validate metadata (size, type) before upload
   - Step 2: Validate actual file content during upload
   - Prevents invalid files from consuming storage

3. **Better Error Handling:**
   - Can catch issues before the file is uploaded
   - Database record created first, then file uploaded
   - Easier to clean up if upload fails

4. **Security:**
   - Time-limited upload URLs
   - Can restrict uploads to specific file types/sizes
   - Prevents unauthorized uploads

5. **Scalability:**
   - Pre-validates file metadata before upload
   - Reduces API server bandwidth for invalid uploads
   - Better for high-volume scenarios with upfront validation

### **When to Use Each:**

| Use Case | Recommended Route |
|----------|------------------|
| Small files (< 10MB) | `POST /api/files` (Direct Upload) |
| Large files (> 10MB) | Presigned Upload (`presign/upload` → `/{id}/upload`) |
| Need metadata validation first | Presigned Upload |
| Simple use case | Direct Upload |
| High-volume uploads | Presigned Upload |

---

## 📋 Alignment with Document Requirements

### ✅ **From `vero.txt.txt` - Requirements Met:**

1. **Secure File Upload** (Line 199, 2199):
   - ✅ Antivirus scanning implemented
   - ✅ File type validation implemented
   - ✅ Size limits implemented (configurable via `MAX_UPLOAD_BYTES`)

2. **File Storage** (Line 16-17, 466-473):
   - ✅ File upload/download endpoints
   - ✅ File metadata storage
   - ✅ Support for: Profile pictures, Product images, Documents, Videos, Medical records

3. **Security Features:**
   - ✅ File type validation (MIME type whitelist)
   - ✅ File extension validation
   - ✅ Magic bytes verification (prevents file type spoofing)
   - ✅ Filename sanitization
   - ✅ Antivirus scanning (basic + ready for ClamAV)

### 📝 **Document Mentions:**
- Line 466-473: "AWS S3 / MinIO - Object storage" - Implemented using local filesystem storage (can be migrated to S3/MinIO in future if needed)
- Line 199, 2199: "Secure File Upload - Antivirus scanning, file type validation, size limits" - ✅ All implemented

---

## 🎯 Recommended Simplification

Based on your question, if you prefer a **simpler single-route upload**, you can:

1. **Use Direct Upload Only:**
   - Remove presigned upload routes
   - Use only `POST /api/files` for all uploads
   - Simpler for most use cases

2. **Keep Both (Recommended):**
   - Use Direct Upload for small files (< 10MB)
   - Use Presigned Upload for large files (> 10MB)
   - Provides flexibility

---

## 📊 Route Summary Table

| Method | Route | Purpose | Use Case |
|--------|-------|---------|----------|
| POST | `/presign/upload` | Request upload URL | Large files, pre-validation |
| POST | `/{id}/upload` | Complete upload | Step 2 of presigned upload |
| POST | `/` | Direct upload | Small files, simple cases |
| POST | `/presign/download` | Request download URL | Temporary download links |
| GET | `/{id}/download` | Download file | Direct file download |
| GET | `/` | List files | Browse/search files |
| GET | `/{id}` | Get metadata | File information |
| PATCH | `/{id}/metadata` | Update metadata | Edit file info |
| DELETE | `/{id}` | Delete file | Remove file |
| POST | `/{id}/restore` | Restore file | Undelete |
| POST | `/{id}/scan` | Update scan status | External scanner integration |
| GET | `/{id}/scan` | Get scan status | Check antivirus results |
| POST | `/{id}/share` | Create share | Share file with others |
| GET | `/{id}/shares` | List shares | View all shares |
| DELETE | `/{id}/share/{shareId}` | Delete share | Revoke access |

---

## 🔧 Configuration

**Environment Variables:**
```bash
LOCAL_STORAGE_PATH=/app/storage          # Where files are stored
MAX_UPLOAD_BYTES=10485760                 # 10MB default
ALLOWED_MIME_TYPES=                       # Custom MIME types (optional)
ALLOWED_FILE_EXTENSIONS=                  # Custom extensions (optional)
ENABLE_ANTIVIRUS_SCAN=true                # Enable/disable scanning
```

---

## 💡 Recommendation

**For your use case**, if you want **simplicity**, you can:
1. Use **Direct Upload** (`POST /api/files`) for all uploads
2. Remove presigned upload routes if not needed
3. Keep presigned download for secure, time-limited access

The presigned pattern is **not required** by the document - it's an architectural choice for better scalability and large file handling. A simple upload route would work fine for most scenarios.

