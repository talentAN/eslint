/** @format */

// 添加devDependencies
const addDevDependencies = dep => {
  process.argv.DEPENDENCIES = process.argv.DEPENDENCIES || [];
  if (Array.isArray(dep)) {
    process.argv.DEPENDENCIES.push(...dep);
  } else {
    process.argv.DEPENDENCIES.push(dep);
  }
};

// 去重添加配置
const addSingle = (name, targets) => {
  if (targets.indexOf(name) === -1) {
    targets.push(name);
  }
};

module.exports = {
  addDevDependencies,
  addSingle
};
