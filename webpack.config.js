const _ = require('lodash');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(paths){
    return {
        entry: {
            'widgets': './src/widgets.js',
            'widgetsGraphiql': './src/widgets-graphiql.js',
            'widgetsGraph': './src/widgets-graph.js'
        },
        output: {
            filename: '[name].js',
            // globalObject: 'this',
            libraryTarget: 'window',
            library: '[name]',
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
                // {
                //     test: /\.s[ac]ss$/i,
                //     use: [
                //         // Creates `style` nodes from JS strings
                //         'style-loader',
                //         // Translates CSS into CommonJS
                //         'css-loader',
                //         // Compiles Sass to CSS
                //         'sass-loader',
                //     ],
                // },
                // {
                //     test: /\.css$/i,
                //     use: [
                //         // Creates `style` nodes from JS strings
                //         'style-loader',
                //         // Translates CSS into CommonJS
                //         'css-loader',
                //         // Compiles Sass to CSS
                //         // 'sass-loader',
                //     ],
                // },

                {
                    test: /\.s[ac]ss$/i,
                    include: paths,
                    use: ExtractTextPlugin.extract({
                        publicPath: 'http://localhost:63342/widgets/dist/',
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
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
        plugins: [
            new VueLoaderPlugin(),
            new ExtractTextPlugin('assets/css/widgets.css')
        ]
    }};