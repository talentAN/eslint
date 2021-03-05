/**
 * auth: spe@sensorsdata.com
 *  extend 提供的是 eslint 现有规则的一系列预设
 *  plugin 则提供了除预设之外的自定义规则，当你在 eslint 的规则里找不到合适的的时候就可以借用插件来实现了
 * @format
 */
const reactEslint = require('../config/frame/react');
const basicEslint = require('../config/basic');
const tsEslint = require('../config/ts');

const { FRAME } = require('../consts');
const { addDevDependencies, reduceArr } = require('../utils/process');
// 添加TS相关配置
const _addTsConfig = () => {
  process.argv.ESLINT_CONFIG.extends.push(...tsEslint.extends);
  process.argv.ESLINT_CONFIG.plugins.push(...tsEslint.plugins);
  addDevDependencies(...tsEslint.dependencies);
};

// 添加框架(React | VueJS)相关配置
const _addFrameConfig = () => {
  const { frame } = process.argv.REPO_CONFIG;
  if (frame === FRAME.React) {
    // 添加babel所需配置
    process.argv.BABEL_CONFIG.presets.push('@babel/preset-react');
    process.argv.BABEL_CONFIG.plugins.push('@babel/plugin-proposal-class-properties');
    process.argv.ESLINT_CONFIG.extends.push(...reactEslint.extends);
    process.argv.ESLINT_CONFIG.plugins.push(...reactEslint.plugins);
    addDevDependencies(
      '@babel/preset-react',
      '@babel/plugin-proposal-class-properties',
      ...reactEslint.dependencies
    );
  }
  if (frame === FRAME.VueJS) {
    // TODO:
  }
};

// 添加用于覆盖eslint规则的prettier规则
const _addPrettierConfig = () => {
  process.argv.ESLINT_CONFIG.extends.push('prettier');
  addDevDependencies(['prettier', 'eslint-config-prettier', 'eslint-plugin-prettier']);
  const { useTS } = process.argv.REPO_CONFIG;
  if (useTS) {
    process.argv.ESLINT_CONFIG.extends.push('prettier/@typescript-eslint');
    addDevDependencies('prettier/@typescript-eslint');
  }
};

// 生成 .eslintrc.js
const parseRepoConfig = () => {
  const { useTS } = process.argv.REPO_CONFIG;
  const parser = useTS ? '@typescript-eslint/parser ' : '@babel/eslint-parser';
  addDevDependencies('eslint', parser, ...basicEslint.dependencies);
  process.argv.ESLINT_CONFIG = {
    extends: [...basicEslint.extends],
    plugins: [...basicEslint.plugins],
    parser,
    env: {
      browser: true,
      es6: true,
      node: true
    },
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6,
      env: { es6: true },
      allowImportExportEverywhere: false,
      ecmaFeatures: {
        globalReturn: false,
        jsx: true
      },
      babelOptions: {
        // parser用了babel的，所以要读取babel配置信息
        configFile: './babel.config.js'
      }
    }
  };
  if (useTS) {
    _addTsConfig();
  }
  _addFrameConfig();
  // 添加prettier配置
  _addPrettierConfig();
  process.argv.ESLINT_CONFIG.extends = reduceArr(process.argv.ESLINT_CONFIG.extends);
  process.argv.ESLINT_CONFIG.plugins = reduceArr(process.argv.ESLINT_CONFIG.plugins);
};

module.exports = {
  parseRepoConfig
};
