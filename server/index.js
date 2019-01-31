const fs = require('fs');
const path = require('path');
const browserSync = require('browser-sync');
const config = require('config');
const webpack = require('webpack');
const webpackConfig = require('../internals/webpack/webpack.development.babel');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const BUILD_DIR_PATH = path.join(process.cwd(), config.BUILD_DIR_PATH);
const compiler = webpack(webpackConfig);

browserSync({
  files: [
    `${BUILD_DIR_PATH}/**/*`
  ],
  // open: 'external',
  port: config.PORT,
  server: {
    baseDir: [BUILD_DIR_PATH],
    routes: {
      '/node_modules': 'node_modules'
    },
    reloadOnRestart: true,
    injectChanges: true,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    },
    middleware: [
      webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: false,
        quiet: false,
        stats: {
          cached: true,
          cachedAssets: true,
          children: true,
          chunks: false,
          chunkModules: false,
          colors: true,
          errorDetails: true,
          hash: false,
          modules: false,
          reasons: true,
          source: true,
          timings: true,
          version: true
        }
      }),
      webpackHotMiddleware(compiler)
    ]
  }
});
