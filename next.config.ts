import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.entry = {
        ...config.entry,
        'firebase-messaging-sw': './public/firebase-messaging-sw.js',
      };
    }
    return config;
  }
};

export default nextConfig;
