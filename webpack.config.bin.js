module.exports = {
  target: 'node',
  entry: './lib/cli.ts',
  output: {
    path: __dirname + '/bin',
    filename: 'cli.js',
    library: 'cli',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  externals: [{
    'commander': 'commonjs commander',
    'mkdirp': 'commonjs mkdirp',
    'promise-map-limit': 'commonjs promise-map-limit',
    'rimraf': 'commonjs rimraf',
    },
    function(context, request, callback) {
      if (/^lodash\.*/.test(request)){
        return callback(null, 'commonjs ' + request);
      }
      callback();
  }],
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      use: [{loader: 'ts-loader'}]
    }]
  }
};
