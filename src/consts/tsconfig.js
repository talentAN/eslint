/** @format */

module.exports = {
  compilerOptions: {
    target: 'es5',
    allowJs: true,
    allowSyntheticDefaultImports: true,
    forceConsistentCasingInFileNames: true,
    module: 'esnext',
    moduleResolution: 'node',
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: 'react',
    baseUrl: '.'
  },
  include: ['src', 'demo', '.eslintrc.js'],
  exclude: ['node_modules']
};
