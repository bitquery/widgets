const _ = require('lodash');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path')

module.exports = function(paths){
    return {
        entry: {
            'widgets': './src/widgets.js',
            'widgetsGraphiql': './src/widgets-graphiql.js',
            'widgetsJquery': './src/widgets-jquery.js'
        },
        output: {
            filename: '[name].js',
            // path: path.resolve(__dirname, '../explorer/app/javascript/packs'),
            // globalObject: 'this',
            libraryTarget: 'window',
            library: '[name]'
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                'vue-i18n$': 'vue-i18n/dist/vue-i18n.esm.js'
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.s[ac]ss$/i,
                    include: paths,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: 'https://cdn.jsdelivr.net/gh/bitquery/widgets@v1.0.60/',
                                minimize: true
                            },
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                },

                {
                    test: /\.(gif|jpg|png)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'assets/images/[name].[ext]'
                    }

                }
            ]
        },
        optimization: {
            minimize: true,
            removeAvailableModules: true,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
                test: /\.js$/,
            }),
                new OptimizeCSSAssetsPlugin({})
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: 'assets/css/widgets.css'
            })
        ]
    }};
