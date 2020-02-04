// eslint-disable-next-line no-undef
const webpack = require('webpack')
// eslint-disable-next-line no-undef
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// eslint-disable-next-line no-undef
module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		content: './src/content.js',
		background: './src/background.js',
		options: './src/options.js',
		popup: './src/popup.js'
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					'css-loader',
					'sass-loader'
				],
			},
			{
				test: /\.css$/i,
				use: [
					'vue-style-loader',
					'css-loader',
				],
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.html$/i,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
					},
				}],
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: [{
					loader: 'url-loader',
				}],
			},
			{
				test: /\.json$/,
				loader: 'file-loader',
				type: 'javascript/auto',
				options: {
					name: '[name].[ext]'
				}
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new VueLoaderPlugin()
	],
}