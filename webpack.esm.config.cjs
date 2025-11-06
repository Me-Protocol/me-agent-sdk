const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "me-agent-sdk.js",
    library: {
      type: "module",
    },
    environment: {
      module: true,
    },
    clean: false, // Don't clean dist folder
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      crypto: false,
      stream: false,
      assert: false,
      http: false,
      https: false,
      os: false,
      url: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false, // Don't minimize ES module version for better debugging
  },
  devtool: "source-map",
};
