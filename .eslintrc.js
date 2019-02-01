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
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 2,
    'import/no-webpack-loader-syntax': 0,
    'import/prefer-default-export': 0,
    // 'import/extensions': 'off',
    // 'import/no-extraneous-dependencies': [
    //   'error',
    //   {
    //     devDependencies: true
    //   }
    // ],
    // 'import/no-named-as-default': 'off',
    // 'import/no-unresolved': 'error',
    'max-len': 'off',
    'no-console': 'off',
    'no-param-reassign': [
      'error',
      {
        props: false
      }
    ],
    // 'no-unused-vars': 'error',
    'no-unused-vars': 'off',
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
