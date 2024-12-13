const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./handler.js",
  target: "node",
  externals: [nodeExternals()],
  mode: "production",
  output: {
    path: path.resolve(__dirname, ".webpack"),
    filename: "handler.js",
    libraryTarget: "commonjs2",
  },
};
