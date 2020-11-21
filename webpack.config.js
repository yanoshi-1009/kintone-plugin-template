const path = require('path');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');
module.exports = {
  mode: 'development', // productionにしたい場合はコマンドラインで上書き可能
  entry: {
    config: './src/js/config.js',
    desktop: './src/js/desktop.js',
    mobile: './src/js/mobile.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'js'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      modules: path.join(__dirname, 'node_modules'),
      common: path.join(__dirname, 'common')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {url: false}
          },
          'sass-loader'
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/i,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: './manifest.json',
      privateKeyPath: './private.key',
      pluginZipPath: './dist/plugin.zip'
    })
  ]
};
