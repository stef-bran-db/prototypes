const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  webpack: (config) => {
    const dsPath = path.dirname(
      require.resolve("@databricks/design-system/package.json"),
    );
    config.resolve.alias["@databricks/design-system$"] = path.join(
      dsPath,
      "dist/index.js",
    );
    config.resolve.alias["@databricks/design-system/development"] = path.join(
      dsPath,
      "dist/development.js",
    );
    config.resolve.alias["@radix-ui/react-tooltip-patch"] =
      require.resolve("@radix-ui/react-tooltip");
    return config;
  },
};

module.exports = nextConfig;
