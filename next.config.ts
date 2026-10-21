import { existsSync } from "node:fs";
import type { NextConfig } from "next";

// Next.js only reads .env* files
if (existsSync("local.env")) {
  process.loadEnvFile("local.env");
}

const nextConfig: NextConfig = {};

export default nextConfig;
