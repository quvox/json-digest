/**
 * webpack.config.js
 */

const common = require('./webpack.common.js');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ShakePlugin = require('webpack-common-shake').Plugin;

// webpack main configration
const webpackConfig = {
  mode: 'production',
  plugins:[
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 1000}),
    new ShakePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        STAGING_PARAMS: JSON.stringify(common.applicationEnv),
      }
    })
  ]
};

module.exports = (env, argv) => {
  if(argv.mode !== 'production') throw new Error('Not production mode!!');

  const config = merge.smart(common.webpackConfig, webpackConfig);
  config.output.filename = common.webpackConfig.output.filename.replace(/\.js$/, '.min.js');

  return config;
};

