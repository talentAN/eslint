#!/usr/bin/env node
/** @format */
const { Command } = require('commander');
const inquirer = require('inquirer');
const process = require('process');
const fs = require('fs');
const path = require('path');
const { FRAME } = require('./consts');
const { parseConfig } = require('./utils');
const { print } = require('./utils/print');

// utils
const _getPackageJson = folder => {
  const path_package = path.resolve(folder, 'package.json');
  const content = fs.readFileSync(path_package, { encoding: 'utf8' });
  return JSON.parse(content);
};

// 确定项目配置
const _genModuleConfig = async () => {
  process.argv.CONFIG = process.argv.CONFIG || {};
  // 是否用TS
  const { useTS } = await inquirer.prompt({
    type: 'confirm',
    name: 'useTS',
    default: false,
    message: print.warn('Will you use TypeScript in this repo?'),
  });
  process.argv.CONFIG.useTS = useTS;
  // 选择框架
  const { frame } = await inquirer.prompt({
    type: 'list',
    name: 'frame',
    default: 'React',
    choices: [
      {
        name: `React`,
        value: FRAME.React,
      },
      {
        name: `VueJS`,
        value: FRAME.VueJS,
      },
    ],
    message: print.warn('Which frame will you use?'),
  });
  process.argv.CONFIG.frame = frame;
};

// 删除已存在的配置文件
const _deleteExistedConfigFile = folder => {
  const files = fs.readdirSync(folder);
  const eslintRegex = /\.eslintrc/;
  files.forEach(file => {
    if (file.match(eslintRegex)) {
      fs.rmSync(path.resolve(folder, file));
    }
  });
};

// 写入新的配置文件
const _genConfigFile = folder => {
  const { CONFIG = {} } = process.argv;
  const content = `module.exports = ${JSON.stringify(parseConfig(CONFIG))}`;
  // 根据项目 生成eslintrc.js 或eslintrc.ts
  fs.writeFileSync(path.resolve(folder, '.eslintrc.js'), content);
  print.info('success to add .eslintrc.js ');
  fs.writeFileSync(
    path.resolve(folder, '.prettierrc'),
    `{
    "arrowParens": "avoid",
    "printWidth": 100,
    "tabWidth": 2,
    "useTabs": false,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "bracketSpacing": true
  }
  `
  );
  print.info('success to add .prettierrc');
};

const _addDevDependencies = folder => {
  print.info('success to eslint dependencies in package.json');
};

// add lint-stage and preCommit in package.json
const _addPreCommit = folder => {
  const package = _getPackageJson(folder);
  const lintStagedKey = process.argv.CONFIG.useTS
    ? 'src/**/*.{js,jsx,ts,tsx}'
    : 'src/**/*.{js,jsx}';
  package['lint-staged'] = {
    [lintStagedKey]: 'eslint',
  };
  package.scripts = package.scripts || {};
  package.scripts.lint = `eslint --ext .js src && stylelint \"src/**/*.{css,less}\"`;
  package.scripts.precommit = 'lint-staged';

  fs.writeFileSync(path.resolve(folder, 'package.json'), JSON.stringify(package));
  print.info('success to add lint-stage in package.json');
};

// 初始化
const init = async folder => {
  try {
    folder = path.resolve(__dirname, folder);
    // 1. 判断业务选择，确定引入内容
    await _genModuleConfig();
    // 2. 删除已存在的eslint, prettier配置文件
    _deleteExistedConfigFile(folder);
    // 3. 写入新的配置文件
    _genConfigFile(folder);
    // 4. 修改package.json 开发依赖
    _addDevDependencies(folder);
    // 5. 添加lint-state and preCommit command
    _addPreCommit(folder);
    print.success("everything's done, run npm install and enjoy coding with eslint && prettier! ");
  } catch (error) {
    console.error(error);
  }
};

const program = new Command().arguments('[folder]').action(async (folder = '.') => {
  const { continue: goOn } = await inquirer.prompt({
    type: 'confirm',
    name: 'continue',
    default: true,
    message: print.warn('We will replace your exit .eslintrc.* and .prettierrc'),
  });
  if (!goOn) {
    return;
  }
  init(folder);
});

program.parse(process.argv);
