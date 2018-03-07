const webpack = require('webpack');

let config = {
	entry: './js/app.js',
	output: {
		filename: './bundle.js'
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
		})
	]
}

module.exports = config;