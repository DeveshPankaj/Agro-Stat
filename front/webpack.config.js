const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { link } = require('fs')

const watchOptions = {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: ['**/node_modules'],
}

module.exports = (env, args) => {
    return new Promise((resolve, reject) => {
        const config = {
            // watch: true,
            watchOptions,
            entry: {    
                polyfills: path.join(__dirname, 'polyfills.ts'),
                index: path.join(__dirname, 'src', 'index.ts'),
            },
            mode: 'development',
            devtool: "source-map",
            resolve: {
                extensions: ['.tsx', '.ts', '.js'],
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: 'ts-loader',
                        exclude: /node_modules/,
                    },
                    {test: /\.css$/, use: ['style-loader', 'css-loader']},
                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                          // Creates `style` nodes from JS strings
                          "style-loader",
                          // Translates CSS into CommonJS
                          "css-loader",
                          // Compiles Sass to CSS
                          "sass-loader",
                        ],
                      },
                ],
            },
            output: {
                path: path.join(__dirname, 'dist'),
                filename: '[name]_bundle.js'
            },
            plugins: [
                new webpack.DefinePlugin({
                    process: JSON.stringify({env})
                }),
                new HtmlWebpackPlugin({
                    meta: {
                        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
                    },
                    title: 'Agro stat'
                })
            ]
        }

        resolve([config])
    })
}