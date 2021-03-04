/** @format */

const FRAME = {
  VueJS: 'VueJS',
  React: 'React'
};

const TS_CONFIG = {};

// 兜底的eslint依赖
const BASIC_ESLINT = {
  extends: ['@sc/eslint-config-sensorsdata']
};

const PRETTIER_CONFIG = {
  arrowParens: 'avoid',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true
};

module.exports = {
  FRAME,
  PRETTIER_CONFIG
};
