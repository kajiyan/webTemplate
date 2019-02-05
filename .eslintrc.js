const fs = require('fs');
const prettierOptions = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'));

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'prettier',
    'plugin:promise/recommended',
  ],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'prettier',
    'react',
    'promise',
    'compat'
  ],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': 'off',
    'class-methods-use-this': 'off',
    'compat/compat': 'error',
    'comma-dangle': ['error', 'never'],
    'comma-style': ['error', 'last'],
    'import/imports-first': 'off',
    'import/newline-after-import': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'error',
    'import/no-webpack-loader-syntax': 'off',
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'no-param-reassign': [
      'error',
      {
        props: false
      }
    ],
    'no-unused-vars': 'error',
    'no-use-before-define': 'off',
    'prefer-template': 'error',
    'prettier/prettier': ['error', prettierOptions],
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-filename-extension': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-uses-vars': 'error',
    'react/require-default-props': 'off',
    'react/require-extension': 'off',
    'react/self-closing-comp': 'off',
    'react/sort-comp': 'off',
    'react/prefer-stateless-function': 'off',
    'react/no-danger': 'off',
    'require-yield': 'off'
  }
};
