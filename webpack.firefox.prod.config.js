const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ZipPlugin = require('zip-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')

const fs = require('fs')

const baseConfig = require('./webpack.prod.config.js')

module.exports = merge(baseConfig, {
    optimization: {
        minimize: true
    },
})