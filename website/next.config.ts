import type { NextConfig } from "next";

const isProd = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/NLPCC-2026-Task9-AISB" : "",
  assetPrefix: isProd ? "/NLPCC-2026-Task9-AISB/" : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/NLPCC-2026-Task9-AISB" : "",
  },
};

export default nextConfig;
