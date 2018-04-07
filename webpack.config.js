const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
	entry: './src/js/app.js',
	output: {
		filename: './bundle.js'
	},
	devServer: {
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
				  'file-loader',
				]
			},
			{
				test: /\.scss$/,
				use: [{
						loader: "style-loader" // creates style nodes from JS strings
				}, {
						loader: "css-loader" // translates CSS into CommonJS
				}, {
						loader: "sass-loader" // compiles Sass to CSS
				}]
			}
		]
	},
	node: {
		fs: "empty" // To get socket.io bundling correctly https://github.com/webpack-contrib/css-loader/issues/447
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
	]
}

module.exports = config;