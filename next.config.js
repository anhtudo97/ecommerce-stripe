/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["https:/cdn.sanity.io"],
    loader: 'custom',
    path: 'https://example.com/myaccount/',
  },
};

module.exports = nextConfig;
