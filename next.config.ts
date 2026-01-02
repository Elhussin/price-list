/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/pricelist",
        destination: "/pricelist.htm",
      },
    ];
  },
};

export default nextConfig;
