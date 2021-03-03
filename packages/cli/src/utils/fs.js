/** @format */

const fs = require('fs');
const path = require('path');

// 确保babel配置文件存在, 并获取babel配置信息
const initBabelConfig = folder => {
  const babelConfig = path.resolve(folder, 'babel.config.js');
  if (!fs.existsSync(babelConfig)) {
    fs.writeFileSync(babelConfig, 'module.exports = { presets:[], plugins:[]}');
  }
  const babelInfo = require(babelConfig);
  process.argv.BABEL_CONFIG = babelInfo;
};

module.exports = {
  initBabelConfig
};
