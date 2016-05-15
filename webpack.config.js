module.exports = {
  entry: "./app/App.js",
  output: {
    filename: "bundle.js",
    path: __dirname + '/public',
    publicPath: "/"
  },
  devServer: {
    inline: true,
    port: 4000
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}
