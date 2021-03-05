/** @format */

const { Command } = require('commander');
const { exec } = require('child_process');
const { print } = require('./utils/print');

const program = new Command().action(() => {
  exec('node install @spe/eslint-cli -g', function (err) {
    if (err) {
      console.log(err);
      return;
    }
    const packageJson = require('../package.json');
    print.success(`eslint-cli已更新至${packageJson.version}`);
  });
});

program.parse(process.argv);
