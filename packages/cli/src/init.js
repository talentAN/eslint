#!/usr/bin/env node
/** @format */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const process = require('process');
const fs = require('fs');
const path = require('path');

// 确定项目配置
const _genModuleConfig = async () => {
  process.argv.CONFIG = process.argv.CONFIG || {};
  // 是否用TS
  const { useTS } = await inquirer.prompt({
    type: 'confirm',
    name: 'useTS',
    default: false,
    message: chalk.yellow('Will you use TypeScript?')
  });
  process.argv.CONFIG.useTS = useTS;
  // 选择框架
  const { templateType } = await inquirer.prompt({
    type: 'list',
    name: 'templateType',
    default: 'React',
    choices: [
      {
        name: `React`,
        value: 'React'
      },
      {
        name: `VueJS`,
        value: 'VueJS'
      }
    ],
    message: chalk.yellow('Choose your desired frame')
  });
  process.argv.CONFIG.templateType = templateType;
};

// 删除已存在的配置文件
const _deleteExistedConfigFile = folder => {
  fs.readdir(folder, (err, files) => {
    const eslintRegex = /\.eslintrc/;
    files.forEach(file => {
      if (file.match(eslintRegex)) {
        fs.rm(path.resolve(__dirname, file));
      }
    });
  });
};

// 写入新的配置文件
const _genConfigFile = folder => {
  const { CONFIG = {} } = process.argv;
  const { useTS, templateType } = CONFIG;
  const content = `module.exports = {  }`;
  // 根据项目 生成eslintrc.js 或eslintrc.ts
  fs.writeFile(path.resolve(folder, 'eslintrc.js'), content, 'utf8', () =>
    chalk.green('success, add custom config to .eslintrc.js if you need.')
  );
};

// 初始化
const init = async folder => {
  folder = path.resolve(__dirname, folder);
  // 判断业务选择，确定引入内容
  // await _genModuleConfig();
  // 删除已存在的eslint, prettier配置文件
  // _deleteExistedConfigFile(folder);
  // 写入新的配置文件
  _genConfigFile(folder);
};

const program = new Command().arguments('[folder]').action(async (folder = '.') => {
  console.warn(chalk.yellow('continue will delete your exit eslint rule and make a new one. '));
  const { wantToContinue } = await inquirer.prompt({
    type: 'confirm',
    name: 'wantToContinue',
    default: true,
    message: chalk.yellow('continue?')
  });
  if (!wantToContinue) {
    return;
  }
  init(folder);
});

program.parse(process.argv);
