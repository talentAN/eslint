#!/usr/bin/env node
/** @format */

const { Command } = require('commander');
const packageJson = require('../package.json');
const chalk = require('chalk');

console.log(
  chalk.hex('#00BF8A')('-= eslint-prettier-cli =-'),
  chalk.hex('#307EF2')('v' + packageJson.version)
);

const program = new Command('format')
  .version(packageJson.version)
  .command('init [folder]', 'init project with template ', { executableFile: '../src/init' }) // 初始化配置
  .command('rebuild [folder]', 'rebuild prettier config file with exited eslint config file', {
    executableFile: '../src/rebuild'
  }); // 根据改动过的配置文件，重新生成prettier配置文件

program.parse(process.argv);
