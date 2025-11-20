/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Reduce bundle size
  compress: true,

  // For production builds
  productionBrowserSourceMaps: false,

  // Environment variables
  env: {
    DATABASE_PATH: process.env.DATABASE_PATH || './data/db.json',
  },
};

module.exports = nextConfig;
