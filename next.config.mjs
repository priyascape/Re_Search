/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for Windows caching issues causing 404 errors
  experimental: {
    webpackBuildWorker: false,
  },
  // Disable SWC minification which can cause issues on Windows
  swcMinify: false,
};

export default nextConfig;
