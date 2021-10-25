const withImages = require("next-images");

module.exports = withImages({
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:5080/api/v1/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/cluster/:clusterId",
        destination: "/cluster/:clusterId/status",
        permanent: true,
      },
      {
        source: "/cluster/:clusterId/task/:type/:taskId",
        destination: "/cluster/:clusterId/:type/:taskId/view",
        permanent: true,
      },
    ];
  },
});
