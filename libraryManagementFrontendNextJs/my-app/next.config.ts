import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ── Security Headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      // Apply to all pages
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options',        value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          // Restrict browser features
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // Force HTTPS (1 year)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // XSS protection (legacy browsers)
          { key: 'X-XSS-Protection',       value: '1; mode=block' },
        ],
      },
      // Protected dashboard routes — NEVER cache
      {
        source: '/(superadmin|admin|manager|system|finance|accounting|crm|communication|engagement|seats_shifts_lockers)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma',        value: 'no-cache' },
          { key: 'Expires',       value: '0' },
          { key: 'Surrogate-Control', value: 'no-store' },
        ],
      },
      // Auth pages — don't cache either
      {
        source: '/auth/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
