const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('config');
const glob = require('glob');
const webpack = require('webpack');
const moment = require('moment');

let webpackConfig;

if (process.env.NODE_ENV === 'production') {
  webpackConfig = require('./webpack.production.babel');
} else {
  webpackConfig = require('./webpack.development.babel');
}

const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  if (err) {
    console.error(chalk.red(err.message));
    return;
  }

  console.log(stats.toString({ chunks: false, colors: true }));
});
