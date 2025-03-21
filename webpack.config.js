const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BeforeBuildPlugin = require('before-build-webpack');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const buildPath = path.resolve(__dirname, 'dist');
const publicPath = path.resolve(__dirname, 'public');

module.exports = {
  mode: 'development', 
  entry: path.join(publicPath, 'index.js'),
  output: {
    path: buildPath,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.ts$/,
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
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|ttf)$/i,
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
      template: path.join(__dirname, './public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
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
    extensions: ['.js', '.ts'],
    alias: {
      components: path.join(publicPath, 'components'),
      fonts: path.join(publicPath, 'fonts'),
      img: path.join(publicPath, 'img'),
      libs: path.join(publicPath, 'libs'),
      pages: path.join(publicPath, 'pages'),
      utils: path.join(publicPath, 'utils'),
    },
  },
};


