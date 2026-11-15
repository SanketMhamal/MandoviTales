import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is built ahead of time into ./out, so any static host can serve it
  // (Cloudflare Pages: see DEPLOY.md).
  output: "export",
};

export default nextConfig;
