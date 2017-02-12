const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const config = require('./global-config');
const postcssValues = require('postcss-modules-values');

const envVars = ['NODE_ENV', 'STRIPE_PUBLIC_KEY', 'GOOGLE_TRANSLATE_KEY', 'PLATFORM'];

module.exports = [{
  devtool: config.webpackDevtool,
  entry: ["babel-polyfill", "./app/components/web/index.js"],
  output: {
    path: path.join(__dirname, '/server/public'),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars)
  ],
  postcss: [postcssValues],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": [
            "es2015",
            "stage-1",
            "react"
          ],
          "plugins": ["transform-decorators-legacy"]
        }
      },
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, './node_modules/react-icons/io')],
        loader: 'babel',
        query: {
          "presets": [
            "es2015",
            "react"
          ]
        }
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        loader: [
          "style",
          "css?modules&localIdentName=[name]_[local]_[hash:base64:5]",
          "postcss-loader",
          "sass"
        ].join('!')
      },
      {
        test: /\.s?css$/,
        include: /node_modules/,
        loader: "style!css"
      },
      {
        test: /\.json$/,
        loader: "json"
      }
    ]
  }
},
{
  target: 'node',
  node: {
    __dirname: false
  },
  externals: [nodeExternals()],
  entry: './server/index.js',
  output: {
    path: path.join(__dirname, 'server'),
    filename: "server.bundle.js"
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars)
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": [
            "es2015",
            "stage-1"
          ],
          "plugins": ["transform-decorators-legacy"]
        }
      }
    ]
  }
}];