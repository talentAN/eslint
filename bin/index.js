#!/usr/bin/env node
/** @format */

const { Command } = require('commander');
const packageJson = require('../package.json');
const chalk = require('chalk');

console.log(
  chalk.hex('#00BF8A')('-= sensors-eslint-cli =-'),
  chalk.hex('#307EF2')('v' + packageJson.version)
);

const program = new Command('eslint-cli')
  .version(packageJson.version)
  .command('init [folder]', 'init project with template ', { executableFile: '../src/init' }) // 初始化配置
  .command('update', 'update eslint-cli to latest version', { executableFile: '../src/update' }); // 初始化配置

program.parse(process.argv);
