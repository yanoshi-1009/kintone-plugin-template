const KintonePlugin = require("@kintone/webpack-plugin-kintone-plugin");
module.exports = (env, argv) => ({
  entry: {
    config: "./src/js/config.js",
    desktop: "./src/js/desktop.js",
    mobile: "./src/js/mobile.js"
  },
  output: {
    path: __dirname + "/dist/js",
    filename: "[name].js"
  },
  resolve: {
    alias: {
      modules: __dirname + "/node_modules",
      common: __dirname + "/common"
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false }
          },
          "sass-loader"
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/i,
        type: "asset"
      }
    ]
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: "./manifest.json",
      privateKeyPath: "./private.key",
      pluginZipPath: "./dist/plugin.zip"
    })
  ]
});
