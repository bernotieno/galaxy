/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint in production builds
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily disable TypeScript checking for production build
  },
  images: {
    domains: ['worldview.earthdata.nasa.gov'], // Allow NASA Worldview images
    unoptimized: false, // Enable image optimization for production
  },

  // Performance optimizations
  experimental: {
    scrollRestoration: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Remove NODE_ENV from env config as it's not allowed
}

export default nextConfig
