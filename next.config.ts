import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // ===================================================
  // BARIS BARU WAJIB UNTUK GITHUB PAGES (Static Export)
  // ===================================================
  output: 'export',

  // base path harus sesuai dengan nama repositori Anda: /siakad_tkj
  basePath: '/siakad_tkj',

  // ===================================================

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Tambahkan unoptimized: true agar component Image Next.js berfungsi di Static Export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-tkj-1758129580228.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
