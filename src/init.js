#!/usr/bin/env node
/** @format */
const { Command } = require('commander');
const inquirer = require('inquirer');
const process = require('process');
const prettier = require('prettier');
const fs = require('fs');
const path = require('path');
const { FRAME, PRETTIER_CONFIG } = require('./consts');
const { parseRepoConfig } = require('./utils');
const { print } = require('./utils/print');
const { initContext, writeJson } = require('./utils/fs');
const { reduceArr } = require('./utils/process');

// utils
const _getPackageJson = folder => {
  const path_package = path.resolve(folder, 'package.json');
  const content = fs.readFileSync(path_package, { encoding: 'utf8' });
  return JSON.parse(content);
};

// add husky and link-stage
const _addPreCommit = package => {
  process.argv.DEPENDENCIES.push('lint-staged', 'husky');
  // 设置link-stage
  const lintStagedKey = process.argv.REPO_CONFIG.useTS
    ? 'src/**/*.{js,jsx,ts,tsx}'
    : 'src/**/*.{js,jsx}';
  package['lint-staged'] = {
    [lintStagedKey]: 'eslint'
  };
  package.scripts = package.scripts || {};
  package.scripts.lint = `eslint --ext .js src && stylelint \"src/**/*.{css,less}\"`;
  package.husky = {
    hooks: {
      'pre-commit': 'lint-staged'
    }
  };
};

// 确定项目配置
const _genModuleConfig = async () => {
  // 是否用TS
  const { useTS } = await inquirer.prompt({
    type: 'confirm',
    name: 'useTS',
    default: false,
    message: print.warn('Will you use TypeScript in this repo?')
  });
  process.argv.REPO_CONFIG.useTS = useTS;
  // 选择框架
  const { frame } = await inquirer.prompt({
    type: 'list',
    name: 'frame',
    default: 'React',
    choices: [
      {
        name: `React`,
        value: FRAME.React
      },
      {
        name: `VueJS`,
        value: FRAME.VueJS
      }
    ],
    message: print.warn('Which frame will you use?')
  });
  process.argv.REPO_CONFIG.frame = frame;
};

// 删除已存在的eslint, prettier配置文件
const _deleteExistedConfigFile = folder => {
  const files = fs.readdirSync(folder);
  const [eslintReg, prettierReg] = [/\.eslintrc/, /\.prettierrc/];
  files.forEach(file => {
    if (file.match(eslintReg) || file.match(prettierReg)) {
      fs.rmSync(path.resolve(folder, file));
    }
  });
};

// 写入新的配置文件(eslint, prettier, babel)
const _genConfigFile = folder => {
  const content = `module.exports = ${JSON.stringify(parseRepoConfig())}`;
  // 生成.eslintrc.js
  fs.writeFileSync(path.resolve(folder, '.eslintrc.js'), prettier.format(content));
  print.info('success to add .eslintrc.js ');
  // 生成.prettierrc
  writeJson(path.resolve(folder, '.prettierrc'), PRETTIER_CONFIG);
  print.info('success to add .prettierrc');
  // 生成babel.config.js
  fs.writeFileSync(
    path.resolve(folder, 'babel.config.js'),
    prettier.format(`module.exports = ${JSON.stringify(process.argv.BABEL_CONFIG)}`)
  );
  print.info('success to update babel.config.js');
};

// 修改package.json
const _modifyPackageJson = folder => {
  const package = _getPackageJson(folder);
  package.devDependencies = package.devDependencies || {};
  // add husky and link-stage
  _addPreCommit(package);
  // add devDependencies
  const { DEPENDENCIES, BABEL_CONFIG, ESLINT_CONFIG } = process.argv;
  reduceArr([
    ...DEPENDENCIES,
    ...BABEL_CONFIG.presets,
    ...BABEL_CONFIG.plugins,
    ...ESLINT_CONFIG.extends,
    ...ESLINT_CONFIG.plugins
  ]).forEach(dep => (package.devDependencies[dep] = 'latest'));
  writeJson(path.resolve(folder, 'package.json'), package);
  print.info('success to add lint-stage in package.json');
};

// 初始化
const init = async folder => {
  folder = path.resolve(__dirname, folder);
  // 初始化相关context
  initContext(folder);
  // 1. 判断业务选择，确定引入内容
  await _genModuleConfig();
  // 2. 删除已存在的eslint, prettier配置文件
  _deleteExistedConfigFile(folder);
  // 3. 写入新的配置文件
  _genConfigFile(folder);
  // 4. 添加lint-state and preCommit command, 添加devDependence依赖
  _modifyPackageJson(folder);
  // 5. 格式化已生成的.eslintrc.js, .prettierrc, babel.config.js
  print.success("everything's done, run npm install and enjoy coding with eslint && prettier! ");
};

const program = new Command().arguments('[folder]').action(async (folder = '.') => {
  const { continue: goOn } = await inquirer.prompt({
    type: 'confirm',
    name: 'continue',
    default: true,
    message: print.warn('We will replace your exited .eslintrc.* and .prettierrc.')
  });
  if (!goOn) {
    return;
  }
  init(folder);
});

program.parse(process.argv);
