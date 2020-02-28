const path = require('path');

module.exports = {
  entry: {main: './src/index.js'},
  output: {
    filename: 'index_bundle.js',
    path: __dirname + '/dist/'
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  watch: true
};
