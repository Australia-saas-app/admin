/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/admin',
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',

      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/login',
        basePath: false,
        permanent: false,
      },
    ];
  },
  // Rewrites removed - using custom proxy API route instead
};

module.exports = nextConfig;