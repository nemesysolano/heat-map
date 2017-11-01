/*
    ./webpack.config.js
*/
const path = require('path');
const TEMPLATES_DIR=path.resolve('./templates');
const RELEASE_DIR=path.resolve('../release');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: `${TEMPLATES_DIR}/index.html`,
  filename: './index.html',  
  inject: 'body'
})

module.exports = {
  entry: './index.js',
  output: {
    path: RELEASE_DIR,
    filename: 'index.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  
  devServer: {
	  inline:true,
    port: 9090,
    host: "0.0.0.0"
  },  
  plugins: [HtmlWebpackPluginConfig]
}