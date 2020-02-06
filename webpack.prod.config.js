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
        documentEndContent: './src/documentEndContent.js',
        background: './src/background.js',
        options: './src/options.js',
        popup: './src/popup.js',
        documentStartContent: './src/documentStartContent.js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                          sassOptions: {
                            indentWidth: 4,
                            outputStyle: 'expanded',
                            includePaths: ['absolute/path/a', 'absolute/path/b'],
                          },
                        },
                      },
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
            {
                test: /\.txt$/i,
                use: 'raw-loader',
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