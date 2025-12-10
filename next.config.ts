import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },

  basePath: '/blue-vending',        // ชื่อ repo ของคุณ
  assetPrefix: '/blue-vending/',    // ชื่อ repo ของคุณ
};

module.exports = nextConfig;
