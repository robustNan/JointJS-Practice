const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    host: 'localhost',
    hot: true,
    https: false,
    port: 8888
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      favicon: './static/image/favicon.png',
      filename: 'index.html',
      inject: 'body',
      template: './index.html',
      title: 'JointJS-Practice'
    })
  ]
});
