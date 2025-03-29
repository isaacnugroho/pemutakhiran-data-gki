/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PREFILLED_FORM_ID: process.env.PREFILLED_FORM_ID || 'not_the_actual_PREFILLED_FORM_ID',
  },
  // This allows Next.js to serve static files from the public directory
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
}

module.exports = nextConfig
