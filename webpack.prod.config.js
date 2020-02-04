const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ZipPlugin = require('zip-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'production',
    optimization: {
        minimize: false
    },
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
        new VueLoaderPlugin(),
        new CopyPlugin([
            { from: 'static', to: '' },
        ]),
        new ZipPlugin({
            path: '../zip',
            filename: 'rbavg'
        })
    ],
}