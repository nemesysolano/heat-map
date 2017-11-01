const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './index.js'
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'React + WebPack + Babel'
		})
	],
	output: {
		filename: 'heat-map.bundle.js',
		path: path.resolve(__dirname, '../release')
	}
};