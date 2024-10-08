const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: [
    './src/front/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        // Rule for handling audio files
        test: /\.(mp3|wav|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]', // Adjust the output filename format as needed
              outputPath: 'sounds/', // Specify the output directory for sound files
            },
          },
        ],
      },
      {
        // Rule for handling JavaScript and JSX files
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        // Rule for handling CSS and SCSS files
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader', // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS
          },
        ],
      },
      {
        // Rule for handling images
        test: /\.(png|svg|jpg|gif|jpeg|webp)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
      {
        // Rule for handling font files
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'], // Added .jsx to extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: 'iconoweb.ico',
      template: 'template.html',
    }),
    new Dotenv({ safe: true, systemvars: true }),
  ],
};
