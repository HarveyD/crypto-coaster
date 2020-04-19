const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let config = {
  entry: "./src/js/app.js",
  output: {
    path: "build.js",
    path: __dirname + "/build"
  },
  devServer: {
    contentBase: "./build"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: ["file-loader"]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: { minimize: true }
            },
            "sass-loader"
          ]
        })
      }
    ]
  },
  node: {
    fs: "empty" // To get socket.io bundling correctly https://github.com/webpack-contrib/css-loader/issues/447
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        removeComments: true,
        removeEmptyAttributes: true
      }
    }),
    new ExtractTextPlugin(
      "styles.css"
    ) /* extracts css to a separate file as opposed to inlining css */
  ]
};

module.exports = config;
