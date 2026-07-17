# File Storage Service - Security Features

## Overview

The File Storage Service now includes comprehensive security features as required by the system documentation:

1. **File Type Validation** - MIME type whitelist
2. **Antivirus Scanning** - Content analysis and malicious pattern detection
3. **Enhanced Security Checks** - File extension validation, magic bytes verification, filename sanitization

## Features

### 1. File Type Validation

The service validates files based on:
- **MIME Type Whitelist**: Only allowed MIME types are accepted
- **File Extension Validation**: Only allowed file extensions are accepted
- **Magic Bytes Verification**: File signatures are checked to prevent file type spoofing

#### Default Allowed File Types

**Images:**
- JPEG, PNG, GIF, WebP, SVG

**Documents:**
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, HTML

**Archives:**
- ZIP, RAR, 7Z

**Audio:**
- MP3, WAV, OGG, M4A

**Video:**
- MP4, MOV, AVI, WebM

### 2. Antivirus Scanning

The service performs basic antivirus scanning that:
- Detects suspicious patterns in file content (script tags, JavaScript, etc.)
- Blocks executable files (PE, ELF, Java class files)
- Validates file integrity

**Note:** For production environments, integrate with ClamAV daemon for full antivirus scanning.

### 3. Enhanced Security Checks

- **Filename Validation**: Prevents path traversal, null bytes, and dangerous characters
- **File Size Limits**: Configurable maximum file size (default: 10MB)
- **Magic Bytes Validation**: Verifies file signatures match declared MIME types

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# File Type Validation
# Comma-separated list of allowed MIME types (leave empty for defaults)
ALLOWED_MIME_TYPES=

# Comma-separated list of allowed file extensions (leave empty for defaults)
ALLOWED_FILE_EXTENSIONS=

# Antivirus Scanning
# Set to 'true' to enable basic antivirus scanning
ENABLE_ANTIVIRUS_SCAN=true

# Upload limits (bytes) - example 10MB
MAX_UPLOAD_BYTES=10485760
```

### Customizing Allowed File Types

To restrict file types, set `ALLOWED_MIME_TYPES`:

```bash
# Only allow images and PDFs
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

To restrict file extensions:

```bash
# Only allow specific extensions
ALLOWED_FILE_EXTENSIONS=jpg,png,pdf,doc,docx
```

## Usage

### Direct Upload

When uploading files directly, all validations are automatically applied:

```bash
POST /api/files
Content-Type: multipart/form-data

file: [file]
ownerId: "user-123"
folder: "documents"
```

### Presigned Upload

1. **Request presigned upload URL:**
```bash
POST /api/files/presign/upload
{
  "filename": "document.pdf",
  "mimeType": "application/pdf",
  "size": 1024000,
  "ownerId": "user-123",
  "folder": "documents"
}
```

2. **Upload file to presigned URL:**
```bash
POST /api/files/{id}/upload
Content-Type: multipart/form-data

file: [file]
```

Both steps validate:
- MIME type (step 1)
- File type, size, security, and antivirus (step 2)

## Error Responses

### File Type Not Allowed
```json
{
  "statusCode": 400,
  "message": "MIME type application/x-executable is not allowed. Allowed types: image/jpeg, image/png, ..."
}
```

### File Size Exceeded
```json
{
  "statusCode": 400,
  "message": "File size exceeds maximum allowed size of 10.00MB"
}
```

### File Type Mismatch (Spoofing Detected)
```json
{
  "statusCode": 400,
  "message": "File type mismatch. Declared MIME type: image/png, but file signature indicates: application/pdf. This may indicate file type spoofing."
}
```

### Malicious Content Detected
```json
{
  "statusCode": 400,
  "message": "File contains potentially malicious content. Antivirus scan detected suspicious patterns."
}
```

### Executable File Blocked
```json
{
  "statusCode": 400,
  "message": "Executable files are not allowed for security reasons"
}
```

## Production Recommendations

### ClamAV Integration

For production environments, integrate with ClamAV daemon:

1. Install ClamAV:
```bash
# Docker
docker run -d --name clamav -p 3310:3310 clamav/clamav:latest
```

2. Update `file-validation.service.ts` to use ClamAV:
```typescript
// Uncomment and configure ClamAV integration
const ClamScan = require('clamscan');
const clamscan = await new ClamScan().init();
const { isInfected, viruses } = await clamscan.isInfected(buffer);
if (isInfected) {
  throw new BadRequestException(`File is infected: ${viruses.join(', ')}`);
}
```

### Additional Security Measures

1. **Rate Limiting**: Already configured via `@nestjs/throttler`
2. **File Size Limits**: Configure per file type if needed
3. **Content Scanning**: Extend pattern detection for specific threats
4. **Quarantine**: Implement quarantine for suspicious files

## Testing

Test file validation with Postman:

1. **Valid File Upload:**
   - Upload a valid PDF, image, or document
   - Should succeed with `scanStatus: "clean"`

2. **Invalid File Type:**
   - Try uploading an executable (.exe, .sh)
   - Should be rejected

3. **File Type Spoofing:**
   - Rename a PDF to .png and declare MIME type as image/png
   - Should be rejected due to magic bytes mismatch

4. **Oversized File:**
   - Upload a file larger than MAX_UPLOAD_BYTES
   - Should be rejected

## Implementation Details

### File Validation Service

Located at: `apps/file-storage/src/file/file-validation.service.ts`

Key methods:
- `validateFile(file)`: Comprehensive validation
- `validateMimeType(mimeType)`: MIME type whitelist check
- `validateMagicBytes(buffer, mimeType)`: File signature verification
- `performAntivirusScan(buffer, filename)`: Content analysis

### Integration Points

- **FileService**: Uses `FileValidationService` for all uploads
- **FileController**: Validation applied automatically via service layer
- **Presigned Uploads**: MIME type validated at presign, full validation at upload

## Compliance

These security features align with the system requirements:
- ✅ Secure File Upload
- ✅ Antivirus scanning
- ✅ File type validation
- ✅ Size limits
- ✅ Content security checks

