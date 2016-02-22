// webpack.config.js
module.exports = {
  output: {
    filename: 'bundle.js'       
  },
  module: {
  loaders: [
    {
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015']
      }
    }
  ]
}
};