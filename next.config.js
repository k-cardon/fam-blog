/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['fam-recipe-images.s3.amazonaws.com'], 
    },
    env: {
        VERCEL_URL: process.env.VERCEL_URL,
      },
  };
  
  module.exports = nextConfig;
  