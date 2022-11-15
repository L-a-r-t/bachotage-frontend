/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate")

const nextConfig = nextTranslate({
  reactStrictMode: true,
  swcMinify: false,
})

module.exports = nextConfig
