
const nextConfig = {
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
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', 
    },
    // Add allowedDevOrigins for CORS in development
    allowedDevOrigins: [
      "https://9000-firebase-studio-1749057513672.cluster-f4iwdviaqvc2ct6pgytzw4xqy4.cloudworkstations.dev",
      "https://6000-firebase-studio-1749057513672.cluster-f4iwdviaqvc2ct6pgytzw4xqy4.cloudworkstations.dev"
    ],
  },
};

module.exports = nextConfig;
