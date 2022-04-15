module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'comma-dangle': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-return-assign': 0,
    'consistent-return': 0,
    'func-names': 0,
    'object-curly-newline': 0,
  },
};
