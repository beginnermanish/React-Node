var path = require('path');
var webpack = require('webpack');
var devConfig = require('./webpack.config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var PROD = (process.env.NODE_ENV === 'production')
var config = {
    watch: false,
    devtool: 'source-map',
    entry: {
        app: './client/app/index',
        vendor: devConfig.entry.vendor
    },
    resolve: { alias: {} },
    output: {
        path: path.join(__dirname, '/client/public'),
        filename: 'bundle.js',
        publicPath: './'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            },
            "require.specified": "require.resolve"
        }),
        new ExtractTextPlugin("styles.css"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            '$': "jquery",
            'jQuery': "jquery",
            'window.jQuery': "jquery",
            'window.$': 'jquery'

        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
    ],
    module: {
        noParse: [],
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                include: path.join(__dirname, 'client/app')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')

            },
            {
                test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.(eot|com|json|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
                loader: 'file-loader?publicPath=/&name=fonts/[name].[ext]'
            }
        ]
    }
};

if (PROD) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));
}

module.exports = config;
