/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
};

module.exports = nextConfig;