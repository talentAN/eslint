/** @format */

module.exports = {
  eslint: {
    plugins: [],
    extends: ['@sc/eslint-config-sensorsdata-react']
  },
  babel: {
    presets: ['@babel/preset-react'],
    plugins: ['@babel/plugin-proposal-class-properties']
  }
};
