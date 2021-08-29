const KintonePlugin = require("@kintone/webpack-plugin-kintone-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
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
        test: /\.(jsx?|tsx?)$/,
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
      manifestJSONPath: "./manifest.json", // 本番時には切り替え
      privateKeyPath: "./private.key",
      pluginZipPath: "./dist/plugin.zip"
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false
      })
    ]
  }
};
