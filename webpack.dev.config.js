const path = require('path');
const config = require('./webpack.config.js');

// Start with your production config
module.exports = {
  ...config,
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  }
};