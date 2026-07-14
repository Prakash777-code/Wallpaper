/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },

       {
        protocol: "https",
        hostname: "th.wallhaven.cc",
      },
      {
        protocol: "https",
        hostname: "w.wallhaven.cc",
      },
    ],
  },
};

module.exports = nextConfig;