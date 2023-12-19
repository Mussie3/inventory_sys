/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  images: {
    domains: ["dummyimage.com/"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // exportPathMap: function () {
  //   return {
  //     "/": { page: "/" },
  //     "/product": { page: "/product" },
  //     "/customer": { page: "/customer" },
  //     "/inventory": { page: "/inventory" },
  //     "/sales": { page: "/sales" },
  //     "/users": { page: "/users" },
  //     // Add other routes here
  //   };
  // },

  // target: "server",
  // ssr: true,
};

module.exports = nextConfig;
