const path = require('path');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');
module.exports = {
  mode: 'development', // productionにしたい場合はコマンドラインで上書き可能
  entry: {
    config: './src/config.js',
    desktop: './src/desktop.js',
    mobile: './src/mobile.js'
  },
  output: {
    path: path.resolve(__dirname, 'plugin', 'js'),
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
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/i,
        use: ['url-loader']
      }
    ]
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: './manifest.json',
      privateKeyPath: './private.key',
      pluginZipPath: './dist/plugin.zip'
    })
  ],
  performance: {
    hints: false
  }
};
