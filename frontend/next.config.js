/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint გამოვრთოთ build-ისთვის
  },
  images: {
    unoptimized: true, // ✅ Image warnings-ის თავიდან აცილება
  },
};

module.exports = nextConfig;
