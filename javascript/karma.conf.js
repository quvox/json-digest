// Karma configuration
// Generated on Wed Jun 13 2018 13:09:34 GMT+0900 (JST)
const common = require('./webpack.common.js');
const webpackConfig = require('./webpack.dev.js');
// const babelExtraPlugins = ['babel-plugin-istanbul'];
const getWebpackConfig = () => {
  const config = webpackConfig(null, {mode: 'development'});
  delete config.entry;
  delete config.output;

  return config;
};
const path = require('path');


module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      `./dist/${common.bundleName}`,
      './node_modules/js-crypto-utils/dist/jscu.bundle.min.js',
      './tests/**/*.spec.ts'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './tests/**/*.spec.ts': ['webpack']
    },

    webpack: getWebpackConfig(),

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: [ 'lcov', 'text-summary' ],
      dir: path.join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true,
      'report-config': {
        html: { outdir: 'html' }
      }
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['ChromeHeadless'],
    // browsers: ['Chrome'],
    browsers: ['Chrome-headless'],
    customLaunchers: {
      'Chrome-headless': {
        base: 'Chrome',
        flags: ['--headless', '--remote-debugging-port=9222', '--no-sandbox']
      }
    },

    client: {
      mocha: {
        timeout: 10000
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};

