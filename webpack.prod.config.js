const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ZipPlugin = require('zip-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')

const fs = require('fs')

const baseConfig = require('./webpack.config.js')

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: false,
    optimization: {
        minimize: false
    },
    plugins: [
        new ZipPlugin({
            path: '../zip',
            filename: `rbavg_latest.zip`
        })
    ]
})