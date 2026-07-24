import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: staticExport ? "export" : "standalone",
  basePath,
  trailingSlash: staticExport,
  images: {
    unoptimized: staticExport,
  },
};

export default nextConfig;
