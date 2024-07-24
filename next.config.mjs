import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // appDir: true,
    esmExternals: 'loose',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externalsType = "script"
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    config.experiments['buildHttp'] = [
      'https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js'
    ]
    return config
  },
}

export default bundleAnalyzer(nextConfig)
