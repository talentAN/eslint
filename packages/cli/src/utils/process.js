const addDevDependencies = dep => {
  process.argv.DEPENDENCIES = process.argv.DEPENDENCIES || [];
  if (Array.isArray(dep)) {
    process.argv.DEPENDENCIES.push(...dep);
  } else {
    process.argv.DEPENDENCIES.push(dep);
  }
};

module.exports = {
  addDevDependencies,
};
