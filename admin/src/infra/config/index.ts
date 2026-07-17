const envConfig = {
  backendURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "/admin/api",
  adminBaseUrl: process.env.ADMIN_BASE_URL || "http://35.162.205.9:3002/admin-service",
  platformBaseUrl: process.env.PLATFORM_BASE_URL || "http://35.162.205.9:3006/platform-service",
  storageUrl: process.env.STORAGE_URL || "http://35.162.205.9:3007/api/files",
};

export default envConfig;
