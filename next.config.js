/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // Railway sets PORT env var — Next.js respects it automatically
  // No extra config needed for Railway deployment
};

module.exports = nextConfig;
