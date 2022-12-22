/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig = nextTranslate({
  reactStrictMode: true,
  swcMinify: false,
})

module.exports = withBundleAnalyzer(nextConfig)
