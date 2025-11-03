/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'convoytravels.pk',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.trustindex.io',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
    ],
  },
}

module.exports = nextConfig

