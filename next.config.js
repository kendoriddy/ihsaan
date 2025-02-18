/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "shorturl.at", "cdn.sanity.io", "images.unsplash.com"],
    domains: ["res.cloudinary.com", "shorturl.at"],
  },
};

module.exports = nextConfig;
