const { ESBuildPlugin } = require("esbuild-loader");
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "esbuild-loader",
        options: {
          loader: "ts", // Or 'ts' if you don't need tsx
          target: "es2015",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      fs: false,
      path: false,
    },
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [new ESBuildPlugin()],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
