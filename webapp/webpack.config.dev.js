'use strict'; // eslint-disable-line strict

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'eval',
  resolve: {
    root: path.join(__dirname, 'source')
  },
  entry: [
    './source/client/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('public/style.css', {
      allChunks: true
    })
  ],
  module: {
    loaders: [
      {
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'source'),
        path.join(__dirname, 'app-home.js')
      ]
    },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  }
};
