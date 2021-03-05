/** @format */

// 添加devDependencies
function addDevDependencies() {
  const dep = [...arguments];
  process.argv.DEPENDENCIES = process.argv.DEPENDENCIES || [];
  process.argv.DEPENDENCIES.push(...dep);
}

// 去重
const reduceArr = arr => Array.from(new Set(arr));

module.exports = {
  addDevDependencies,
  reduceArr
};
