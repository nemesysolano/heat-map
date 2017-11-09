const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
     //TODO: UNcomment the next block before building for production.
     /* *
     new UglifyJSPlugin()
     /* */
   ]
,
module: {
  loaders: [
    { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
  ]
}
 });