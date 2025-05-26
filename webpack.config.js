const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const publicPath = path.resolve(__dirname, 'public');

module.exports = {
  mode: 'production', 
  entry: path.join(publicPath, 'index.tsx'),
  output: {
    path: buildPath,
    clean: true,
    filename: 'bundle.js',
    publicPath: '/static/', 
    assetModuleFilename: 'img/[name][ext]'
  },
  module: {
    rules: [
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
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                  importSource: 'libs/rzf',
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 
          'css-loader', 
          'sass-loader'
        ],
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
      }
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(), 
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
      minify: { 
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(publicPath, 'sw.js'),
          to: path.join(buildPath, 'sw.js'),
        },
        {
          from: path.join(publicPath, 'img'),
          to: path.join(buildPath, 'img'),
        },
      ],
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      libs: path.join(publicPath, 'libs'),
      utils: path.join(publicPath, 'utils'),
      components: path.join(publicPath, 'components'),
      pages: path.join(publicPath, 'pages'),
      layouts: path.join(publicPath, 'layouts'),
      img: path.join(publicPath, 'img'),
      fonts: path.join(publicPath, 'fonts'),
      common: path.join(publicPath, 'common'),
      root: publicPath,
    },
  },
};


