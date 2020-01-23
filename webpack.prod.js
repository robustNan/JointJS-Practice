const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  externals: {
    jquery: {
      amd: 'jquery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      root: '$'
    },
    joint: {
      amd: 'joint',
      commonjs: 'joint',
      commonjs2: 'joint',
      root: 'joint'
    },
    lodash: {
      amd: 'lodash',
      commonjs: 'lodash',
      commonjs2: 'lodash',
      root: '_'
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendorLodash: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HtmlWebpackPlugin({
      chunks: 'main',
      hash: true,
      favicon: './static/image/favicon.png',
      filename: 'index.html',
      inject: 'body',
      minify: {
        caseSensitive: true, //是否对大小写敏感
        collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled"简写为disabled
        collapseWhitespace: true, //是否去除空格
        minifyCSS: true, //是否压缩html里的css
        minifyJS: true, //是否压缩html里的js
        preventAttributesEscaping: true, //Prevents the escaping of the values of attributes
        removeAttributeQuotes: true, //是否移除属性的引号，默认false
        removeComments: true, //是否移除注释，默认false
        removeCommentsFromCDATA: true, //从脚本和样式删除的注释，默认false
        removeEmptyAttributes: true, //是否删除空属性，默认false
        removeOptionalTags: false, //若开启此项，生成的html中没有body和head，html也未闭合
        removeRedundantAttributes: true, //删除多余的属性
        removeScriptTypeAttributes: true, //删除script的类型属性，在h5下面script的type默认值：text/javascript，默认false
        removeStyleLinkTypeAttributes: true, //删除style的类型属性， type="text/css" 同上
        useShortDoctype: true //使用短的文档类型，默认false
      },
      template: './index.html',
      title: 'JointJS-Practice'
    })
  ]
});
