module.exports = {
  ...require('@deepsquare/prettier-config'),
  plugins: ['node_modules/@trivago/prettier-plugin-sort-imports', 'node_modules/prettier-plugin-solidity'],
  explicitTypes: 'always',
};
