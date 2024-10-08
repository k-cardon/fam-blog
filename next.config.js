/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'fam-recipe-images.s3.us-east-1.amazonaws.com',
        },
      ],
    },
    env: {
      VERCEL_URL: process.env.VERCEL_URL,
    },
  };
  
  module.exports = nextConfig;