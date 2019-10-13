const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: 'source-map',
  entry: path.resolve(__dirname, "../src/index.ts"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name]-[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../index.html")
    })
  ],
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    compress: true,
    port: 8080,
    hot: true,
    open: true
  }
};
