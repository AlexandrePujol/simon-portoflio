/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.prismic.io" }],
  },
  // @prismicio/* ships ESM-only dual packages; without this, webpack loads
  // their dist files as opaque externals and crashes with "exports is not
  // defined" instead of transforming them like first-party source.
  transpilePackages: ["@prismicio/client", "@prismicio/next", "@prismicio/react"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
