import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    loader: 'custom',
    loaderFile: './loader.js',
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.entry = {
        ...config.entry,
        'firebase-messaging-sw': './public/firebase-messaging-sw.js',
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/_fah/image/:path*',
  //       // TODO: Replace with your actual Cloud Functions URL
  //       destination:
  //         '<CLOUD_FUNCTIONS_URL>/:path*',
  //     },
  //   ];
  // },
  allowedDevOrigins: ['https://*.google.com', 'https://*.firebaseapp.com'],
};

export default nextConfig;
