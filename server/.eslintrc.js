module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }],
    'max-len': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'skipBlankLines': true,
  },
};

