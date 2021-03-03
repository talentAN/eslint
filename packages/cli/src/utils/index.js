/**
 * auth: spe@sensorsdata.com
 *  extend 提供的是 eslint 现有规则的一系列预设
 *  plugin 则提供了除预设之外的自定义规则，当你在 eslint 的规则里找不到合适的的时候就可以借用插件来实现了
 * @format
 */
const { eslint: eslintReact, babel: babelReact } = require('@spe/eslint-config-react');
const { eslint: eslintTs } = require('@spe/eslint-config-ts');

const { FRAME } = require('../consts');
const { addDevDependencies, reduceArr } = require('../utils/process');
// 添加TS相关配置
const _addTsConfig = (config, ret) => {
  ret.plugins.push(...eslintTs.plugins);
  ret.extends.push(...eslintTs.extends);
};

// 添加框架(React | VueJS)相关配置
const _addFrameConfig = (config, ret) => {
  const { frame } = config;
  if (frame === FRAME.React) {
    ret.extends.push(...eslintReact.extends);
    ret.plugins.push(...eslintReact.plugins);
    process.argv.BABEL_CONFIG.presets.push(...babelReact.presets);
    process.argv.BABEL_CONFIG.plugins.push(...babelReact.plugins);
  }
  if (frame === FRAME.VueJS) {
    // TODO:
  }
};

// 添加用于覆盖eslint规则的prettier规则
const _addPrettierConfig = (config, ret) => {
  ret.extends.push('prettier');
  addDevDependencies(['eslint-config-prettier', 'eslint-plugin-prettier']);
  const { useTS, frame } = config;
  if (useTS) {
    ret.extends.push('prettier/@typescript-eslint');
  }
  if (frame === FRAME.React) {
  }
  if (frame === FRAME.VueJS) {
  }
};

// 生成 .eslintrc.js
const parseRepoConfig = config => {
  const { useTS } = config;
  const parser = useTS ? '@typescript-eslint/parser ' : '@babel/eslint-parser';
  addDevDependencies(['eslint', parser]);
  const ret = {
    extends: ['@sc/eslint-config-sensorsdata'],
    plugins: [],
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
    _addTsConfig(config, ret);
  }
  _addFrameConfig(config, ret);
  // 添加prettier配置
  _addPrettierConfig(config, ret);
  ret.extends = reduceArr(ret.extends);
  ret.plugins = reduceArr(ret.plugins);
  process.argv.ESLINT_CONFIG = ret;
  return ret;
};

module.exports = {
  parseRepoConfig
};
