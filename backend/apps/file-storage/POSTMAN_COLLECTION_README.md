# File Storage Service - Postman Collection

Complete API collection for testing all routes of the File Storage Service.

## 📥 Import Instructions

1. Open Postman
2. Click **Import** button (top left)
3. Select the file: `File_Storage_Service.postman_collection.json`
4. The collection will appear in your Postman workspace

## 🔧 Setup Variables

After importing, configure the collection variables:

1. Click on the collection name: **File Storage Service**
2. Go to the **Variables** tab
3. Update these variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3009/api/files` | Base URL of the file storage service |
| `jwt_token_user` | `your-user-jwt-token-here` | User JWT authentication token |
| `jwt_token_admin` | `your-admin-jwt-token-here` | Admin JWT authentication token |
| `file_id` | *(auto-saved)* | ID of uploaded file |
| `folder_id` | *(auto-saved)* | ID of created folder |
| `share_token` | *(auto-saved)* | Share token for public access |
| `presigned_file_id` | *(auto-saved)* | ID of presigned upload file |
| `presigned_upload_url` | *(auto-saved)* | Presigned upload URL |

## 📋 Collection Structure

The collection is organized into the following folders:

### 1. **Health**
- ✅ Health Check - Verify service is running

### 2. **Files - User Token**
- ✅ Upload File - Direct upload with validation
- ✅ List Files - Get files with advanced filters (ownerId, folderId, search, tag, limit, offset)
- ✅ Get File Metadata - Get file details by ID
- ✅ Download File - Download file by ID with presigned URL

### 3. **File Metadata - User Token**
- ✅ Update File Metadata - Update filename, folderId, tags
- ✅ Soft Delete File - Mark file as deleted
- ✅ Restore File - Restore soft-deleted file
- ✅ Get Scan Status - Check antivirus scan results
- ✅ Update Scan Status - Manually update scan status

### 4. **Presigned Upload - User Token**
- ✅ Create Presigned Upload - Get presigned upload URL for large files
- ✅ Complete Presigned Upload - Finalize upload and validation

### 5. **File Versions - User Token**
- ✅ Create New Version - Upload new version of existing file
- ✅ List File Versions - Get all versions of a file
- ✅ Download Specific Version - Download particular version
- ✅ Rollback to Version - Revert file to previous version

### 6. **File Sharing - User Token**
- ✅ Create File Share - Create share link with permissions
- ✅ List File Shares - Get all shares for a file
- ✅ Update Share - Modify share settings
- ✅ Delete Share - Remove share link
- ✅ Access Shared File (Public) - View shared file without auth
- ✅ Download Shared File (Public) - Download shared file without auth

### 7. **Folders - User Token**
- ✅ Create Folder - Create new folder with hierarchy
- ✅ List Folders - Get user's folders
- ✅ Get Folder - Get folder details
- ✅ Update Folder - Rename folder
- ✅ Delete Folder - Remove empty folder

### 8. **Files - Admin Token**
- ✅ Upload File (Admin) - Upload as admin user
- ✅ List Files (Admin) - List all files (no ownership filter)
- ✅ Get File Metadata (Admin) - Get any file details
- ✅ Download File (Admin) - Download any file
- ✅ Delete File (Admin) - Hard delete any file

### 9. **File Metadata - Admin Token**
- ✅ Update File Metadata (Admin) - Update any file metadata
- ✅ Soft Delete File (Admin) - Soft delete any file
- ✅ Restore File (Admin) - Restore any soft-deleted file
- ✅ Get Scan Status (Admin) - Check scan status for any file
- ✅ Update Scan Status (Admin) - Update scan status for any file

### 10. **Folders - Admin Token**
- ✅ Create Folder (Admin) - Create folder as admin
- ✅ List All Folders (Admin) - List all folders in system
- ✅ Get Folder (Admin) - Get any folder details
- ✅ Update Folder (Admin) - Update any folder
- ✅ Delete Folder (Admin) - Delete any empty folder

## 🚀 Quick Start Guide

### Step 1: Test Health Endpoint
1. Open **Health → Health Check**
2. Click **Send**
3. Should return: `{ "status": "ok" }`

### Step 2: Create a Folder
1. Open **Folders - User Token → Create Folder**
2. In the **Body** tab, set:
```json
{
  "name": "documents",
  "ownerId": "user-123",
  "parentId": null
}
```
3. Click **Send**
4. The `folder_id` will be auto-saved to collection variables

### Step 3: Upload a File
1. Open **Files - User Token → Upload File**
2. In the **Body** tab:
    - Select `file` field → Choose File → Select your image/document
    - (Optional) Set `ownerId`: `user-123`
    - (Optional) Set `folderId`: `{{folder_id}}`
    - (Optional) Set `tags`: `["photo", "profile"]`
3. Click **Send**
4. The `file_id` will be auto-saved to collection variables

### Step 4: Download the File
1. Open **Files - User Token → Download File**
2. The `{{file_id}}` variable is already set from the upload
3. Click **Send**
4. The file will download automatically

### Step 5: Update File Metadata
1. Open **File Metadata - User Token → Update File Metadata**
2. In the **Body** tab, modify:
```json
{
  "filename": "updated-name.pdf",
  "folderId": "{{folder_id}}",
  "tags": ["updated", "important"]
}
```
3. Click **Send**

### Step 6: Create File Version
1. Open **File Versions - User Token → Create New Version**
2. Upload a new version of the same file
3. Add change description if desired
4. Click **Send**

### Step 7: Share the File
1. Open **File Sharing - User Token → Create File Share**
2. Set sharing options:
```json
{
  "expiresAt": "2024-12-31T23:59:59Z",
  "permissions": {
    "view": true,
    "download": true
  },
  "maxAccesses": 100
}
```
3. Click **Send**
4. The `share_token` will be auto-saved

### Step 8: Access Shared File (Public)
1. Open **File Sharing - User Token → Access Shared File (Public)**
2. The `{{share_token}}` is already set
3. Click **Send** (no authentication required)

### Step 9: List Files with Filters
1. Open **Files - User Token → List Files**
2. Modify query parameters:
    - `ownerId`: `user-123`
    - `folderId`: `{{folder_id}}`
    - `search`: Search in filename
    - `tag`: Filter by tag
    - `limit`: Number of results
    - `offset`: Pagination offset
3. Click **Send**

## 📝 Request Examples

### Direct Upload (Recommended)
```
POST {{base_url}}
Content-Type: multipart/form-data
Authorization: Bearer {{jwt_token}}

Body (form-data):
  file: [Select File]
  ownerId: user-123
  folder: images
  tags: ["photo", "profile"]
```

### Presigned Upload (Two-Step)
**Step 1:**
```
POST {{base_url}}/presign/upload
Content-Type: application/json
Authorization: Bearer {{jwt_token}}

{
  "filename": "example.pdf",
  "mimeType": "application/pdf",
  "size": 1024000,
  "ownerId": "user-123",
  "folder": "documents"
}
```

**Step 2:**
```
POST {{base_url}}/{{presigned_file_id}}/upload
Content-Type: multipart/form-data
Authorization: Bearer {{jwt_token}}

Body (form-data):
  file: [Select File]
```

### List Files with Filters
```
GET {{base_url}}?ownerId=user-123&folder=images&search=photo&limit=10&offset=0
Authorization: Bearer {{jwt_token}}
```

### Update File Metadata
```
PATCH {{base_url}}/{{file_id}}/metadata
Content-Type: application/json
Authorization: Bearer {{jwt_token_user}}

{
  "filename": "updated-name.pdf",
  "folderId": "{{folder_id}}",
  "tags": ["updated", "tag"]
}
```

### Create Folder
```
POST {{base_url}}/folders
Content-Type: application/json
Authorization: Bearer {{jwt_token_user}}

{
  "name": "documents",
  "ownerId": "user-123",
  "parentId": null
}
```

### Create File Share
```
POST {{base_url}}/{{file_id}}/shares
Content-Type: application/json
Authorization: Bearer {{jwt_token_user}}

{
  "expiresAt": "2024-12-31T23:59:59Z",
  "password": "secret123",
  "permissions": {
    "view": true,
    "download": true
  },
  "maxAccesses": 100
}
```

### Access Shared File (Public)
```
GET {{base_url}}/share/{{share_token}}
```

### Create File Version
```
POST {{base_url}}/{{file_id}}/versions
Content-Type: multipart/form-data
Authorization: Bearer {{jwt_token_user}}

Body (form-data):
  file: [Select File]
  changeDescription: "Updated with new information"
```

## 🔄 Auto-Saved Variables

The collection automatically saves IDs from responses to variables:

### User Token Requests:
- **Upload File** → Saves `file_id` and `file_key`
- **Create Presigned Upload** → Saves `presigned_file_id` and `presigned_upload_url`
- **Create Folder** → Saves `folder_id`
- **Create New Version** → Saves `version_id`
- **Create File Share** → Saves `share_id` and `share_token`

### Admin Token Requests:
- **Upload File (Admin)** → Saves `file_id` and `file_key`
- **Create Folder (Admin)** → Saves `folder_id`

These variables are automatically used in subsequent requests!

## 🔐 Authentication

Most endpoints require JWT authentication:
- Set the `jwt_token` variable in collection variables
- The token is automatically added to all requests via the `Authorization` header

**Exception**: The Health endpoint does NOT require authentication.

## 📊 Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing Workflow

### Basic File Operations:
1. **Health Check** → Verify service is running
2. **Create Folder** → Create a folder structure
3. **Direct Upload** → Upload a test file to folder
4. **Get File Metadata** → Verify file was uploaded correctly
5. **Download File** → Test file download functionality
6. **List Files** → See all uploaded files with filters
7. **Update File Metadata** → Modify filename, folder, tags

### Advanced Features:
8. **Get Scan Status** → Check antivirus scan results
9. **Create File Version** → Upload new version of the file
10. **List File Versions** → See version history
11. **Download Specific Version** → Test version downloads
12. **Create File Share** → Share file with permissions
13. **Access Shared File (Public)** → Test public sharing
14. **Update Share Settings** → Modify share permissions

### Administrative Operations:
15. **Soft Delete File** → Mark file as deleted
16. **Restore File** → Restore soft-deleted file
17. **Hard Delete File** → Permanently remove file

### Folder Management:
18. **List Folders** → View folder structure
19. **Update Folder** → Rename folders
20. **Delete Folder** → Remove empty folders

### Presigned Uploads:
21. **Create Presigned Upload** → Get upload URL for large files
22. **Complete Presigned Upload** → Finalize large file upload

## 💡 Tips

1. **File Upload**: Use "Direct Upload" for simple uploads. It's faster and easier.
2. **Presigned Upload**: Use when you need to upload from a client app without exposing your JWT token.
3. **Variables**: Check collection variables after each request - IDs are auto-saved!
4. **File Types**: Supported types include images (JPEG, PNG, GIF, WebP), documents (PDF, DOC, DOCX), and more based on your validation config.
5. **File Size**: Default max size is 10MB (configurable via `MAX_UPLOAD_BYTES`).

## 🐛 Troubleshooting

### 401 Unauthorized
- Check that `jwt_token` variable is set correctly
- Verify the token hasn't expired
- Health endpoint doesn't require auth

### 404 Not Found
- Verify the `file_id` or `folder_id` exists
- Check that the file wasn't hard-deleted

### 400 Bad Request
- Check request body format (JSON syntax)
- Verify required fields are provided
- Check file type and size limits

### File Not Found on Disk
- If using presigned upload, make sure you completed **Step 2** (uploading the file)
- Check Docker container storage: `docker exec vero2-file-storage ls -lah /app/storage`

## 📚 Additional Resources

- Service Documentation: `FILE_STORAGE_SERVICE_SUMMARY.md`
- Security Features: `SECURITY_FEATURES.md`
- API Swagger Docs: `http://localhost:3009/api/files/docs`

---

**Happy Testing! 🎉**

