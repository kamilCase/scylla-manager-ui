module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5080/api/v1/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/cluster/:clusterId',
        destination: '/cluster/:clusterId/status',
        permanent: true,
      },
    ]
  },
};
