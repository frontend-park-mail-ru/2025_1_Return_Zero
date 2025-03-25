const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BeforeBuildPlugin = require('before-build-webpack');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const publicPath = path.resolve(__dirname, 'public');

module.exports = {
  entry: path.resolve(publicPath, 'index.js'),
  output: {
    path: buildPath,
    clean: true,
    filename: 'bundle.[contenthash].js',
    publicPath: '/static/', 
    assetModuleFilename: 'img/[name][ext]'
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.ts$/i,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript', 
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader'
        ],
      },
      {
        test: /\.hbs$/i,
        loader: 'handlebars-loader',
      },
      {
        test: /\.ttf$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new BeforeBuildPlugin(function(stats, callback) {
      console.log('Compiling Handlebars templates...');
      const { execSync } = require('child_process');
      execSync('for file in $(find public -name *.hbs); do echo \"Compiling $file\"; handlebars $file -f ${file%.hbs}.precompiled.js; done');
      callback();
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(publicPath, 'libs/handlebars-v4.7.8.js'),
          to: path.resolve(buildPath, 'libs/handlebars-v4.7.8.js'),
        },
        {
          from: path.resolve(publicPath, 'img'),
          to: path.resolve(buildPath, 'img'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      components: path.resolve(publicPath, 'components'),
      fonts: path.resolve(publicPath, 'fonts'),
      img: path.resolve(publicPath, 'img'),
      libs: path.resolve(publicPath, 'libs'),
      pages: path.resolve(publicPath, 'pages'),
      utils: path.resolve(publicPath, 'utils'),
    },
  },
};


