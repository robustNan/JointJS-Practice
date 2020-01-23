const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
// const webpack = require('webpack');

module.exports = {
  entry: './src/script/main.js',
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader'
        // use: ['url-loader?name=fonst/[name].[md5:hash:hex:7].[ext]']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractTextPlugin({
      filename: '[name].[hash].css', //随机名称
      allChunks: true
    })
  ]
};
