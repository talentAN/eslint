/**
 * auth: spe@sensorsdata.com
 *  extend 提供的是 eslint 现有规则的一系列预设
 *  plugin 则提供了除预设之外的自定义规则，当你在 eslint 的规则里找不到合适的的时候就可以借用插件来实现了
 * @format
 */

const { FRAME } = require('../consts');
// 添加TS相关配置
const _addTsConfig = (config, ret) => {
  ret.extends.push('plugin:@typescript-eslint/recommended');
  ret.plugins.push('@typescript-eslint');
};

// 添加框架(React | VueJS)相关配置
const _addFrameConfig = (config, ret) => {
  const { useTS, frame } = config;
  if (frame === FRAME.React) {
    ret.plugins.push('react');
    useTS
      ? ret.extends.push('')
      : ret.extends.push(
          'eslint-config-airbnb/rules/react',
          'eslint-config-airbnb/rules/react-a11y',
          'eslint-config-airbnb/rules/react-hooks'
        );
  }
  if (frame === FRAME.VueJS) {
    // TODO:
  }
};

// 添加用于覆盖eslint规则的prettier规则
const _addPrettierConfig = (config, ret) => {
  ret.extends.push('prettier', 'prettier/babel', 'plugin:prettier/recommended');
  const { useTS, frame } = config;
  if (useTS) {
    ret.extends.push('prettier/@typescript-eslint');
  }
  if (frame === FRAME.React) {
    ret.extends.push('prettier/react');
  }
  if (frame === FRAME.VueJS) {
    ret.extends.push('prettier/vue');
  }
};

// 生成 .eslintrc.js
const parseConfig = config => {
  const { useTS } = config;
  const ret = {
    extends: ['@spe/eslint-config-base'],
    plugins: [],
    parser: useTS ? '@typescript-eslint/parser ' : '@babel/eslint-parser',
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    parserOptions: {
      sourceType: 'module',
      allowImportExportEverywhere: false,
      ecmaFeatures: {
        globalReturn: false,
      },
    },
  };
  if (useTS) {
    _addTsConfig(config, ret);
  }
  _addFrameConfig(config, ret);
  // 添加prettier配置
  _addPrettierConfig(config, ret);

  return ret;
};

module.exports = {
  parseConfig,
};
