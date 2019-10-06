const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundled_index.js",
    path: path.join(__dirname, "./dist/")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  watch: true
};
