const chalk = require('chalk');
const webpack = require('webpack');

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
