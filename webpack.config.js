module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    fallback: {
        "zlib": require.resolve("browserify-zlib"),
        "path": require.resolve("path-browserify"),
        "http": false,
        "https": false,
        "url": false,
        "assert": false,
        "buffer": false,
        "stream": false,
        "util": false,
        "fs": false,
        "os": false,
      }
  },
  output: {
    path: '/dist',
    filename: 'bundle.js',
  },
  devServer: {
    static: './dist',
  }
};