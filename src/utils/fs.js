/** @format */

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

// 初始化全局依赖的context
const initContext = folder => {
  // 用户输入的项目配置
  process.argv.REPO_CONFIG = process.argv.REPO_CONFIG || {};
  // eslint配置信息
  process.argv.ESLINT_CONFIG = process.argv.ESLINT_CONFIG || {};
  // 初始化babel信息
  const babelConfig = path.resolve(folder, 'babel.config.js');
  if (!fs.existsSync(babelConfig)) {
    fs.writeFileSync(babelConfig, 'module.exports = { presets:[], plugins:[]}');
  }
  const babelInfo = require(babelConfig);
  process.argv.BABEL_CONFIG = babelInfo;
  // 所需依赖
  process.argv.DEPENDENCIES = process.argv.DEPENDENCIES || [];
};

const writeJson = (path, content) =>
  fs.writeFileSync(path, prettier.format(JSON.stringify(content), { parser: 'json' }));

module.exports = {
  initContext,
  writeJson
};
