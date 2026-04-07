import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Enable MDX pages
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // Performance & security
  poweredByHeader: false,
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack config for 3D assets (WASM support for Rapier physics)
  webpack: (config, { isServer }) => {
    // WASM support for @react-three/rapier
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // GLSL shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });

    // Fix for WASM files in server-side rendering
    if (isServer) {
      config.output.webassemblyModuleFilename =
        './../static/wasm/[modulehash].wasm';
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }

    return config;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
