const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const publicPath = path.resolve(__dirname, 'public');

module.exports = {
  mode: 'development', 
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
        test: /\.tsx$/,
        use: 'ts-loader'
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
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(publicPath, 'img'),
          to: path.join(buildPath, 'img'),
        },
        {
          from: path.join(publicPath, 'sw.js'),
          to: path.join(buildPath, 'sw.js'),
        }
      ],
    }),
  ],
  devServer: {
    port: 8888,
    historyApiFallback: true,
    watchFiles: publicPath,
    client: {
      overlay: false,
    },
  },
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
      root: publicPath,
    },
  },
};


