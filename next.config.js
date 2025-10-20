/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "shorturl.at",
      "cdn.sanity.io",
      "images.unsplash.com",
      "encrypted-tbn0.gstatic.com",
      "via.placeholder.com",
      "iframe.mediadelivery.net",
      "ihsaan-new-pullzone.b-cdn.net",
    ],
  },
};

module.exports = nextConfig;
