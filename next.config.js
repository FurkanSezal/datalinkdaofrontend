/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    UPTADE_FRONT_END: process.env.UPTADE_FRONT_END,
    PINATA_API_KEY: process.env.PINATA_API_Key,
    PINATA_API_SECRET: process.env.PINATA_API_Secret,
    PINATA_JWT: process.env.PINATA_JWT,
    MORALIS_API_KEY: process.env.MORALIS_API_KEY,
    LIGHTHOUSE_API_KEY: process.env.LIGHTHOUSE_API_KEY,
  },
};

module.exports = nextConfig;
