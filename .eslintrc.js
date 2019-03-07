const path = require('path');
module.exports = {
  parser: 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 10,
    'sourceType': 'module',
    allowImportExportEverywhere: true,
  },
  'env': {
    'browser': true,
    'node': true
  },
  'extends': [
    'airbnb-base'
  ],
  'plugins': [
    'import',
  ],
  'globals': {
    'jest': false,
    'expect': false,
    'describe': false,
    'test': false,
  },
  'rules': {
    'strict': 0,
    'semi': 2,
    'import/extensions': ['error', 'always', { 'ignorePackages': true }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true }],
    'no-nested-ternary': 0,
    'no-underscore-dangle': 0,
    'max-len': ['error', { 'ignoreComments': true, 'tabWidth': 2, 'ignoreTemplateLiterals': true, 'code': 120 }],
    'indent': ['error', 2, { 'flatTernaryExpressions': true, 'ignoredNodes': ['ConditionalExpression'] }],
    'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
    'no-prototype-builtins': 0,
    'arrow-parens': ["error", "as-needed"],
    'func-names': ["error", "always", { "generators": "as-needed" }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    "no-restricted-syntax": 0,
    'no-return-assign': ['error'],
    'class-methods-use-this': ['error', { exceptMethods: ['render'] }],
    'no-useless-constructor': 0,
  }
};
