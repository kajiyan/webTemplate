const fs = require('fs');
const prettierOptions = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'));

module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'browser': true,
    'node': true,
    'jest': true,
    'es6': true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  'extends': [
    'eslint:recommended',
    'typescript',
    'prettier'
  ],
  'plugins': ['prettier'],
  'rules': {
    'prettier/prettier': ['error', prettierOptions],
    'arrow-body-style': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    'comma-style': ['error', 'last'],
    'max-len': 'off',
    'no-console': 'off',
    'no-eval': ['error', { 'allowIndirect': false }],
    'no-trailing-spaces': ['error'],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'quotes': ['error', 'single'],
    'require-yield': 'off',
    'semi': ['error', 'always']
  },
  'overrides': {
    'files': ['**/*.ts', '**/*.tsx'],
    'parser': 'typescript-eslint-parser',
    'plugins': ['typescript', 'prettier'],
    'rules': {
      'typescript/adjacent-overload-signatures': 'error',
      'typescript/class-name-casing': 'error',
      'typescript/explicit-function-return-type': 'error',
      'typescript/explicit-member-accessibility': 'error',
      // 'typescript/interface-name-prefix': 'never',
      'typescript/member-delimiter-style': 'error',
      'typescript/member-ordering': [
        'error',
        {
          'default': ['field', 'constructor', 'method']
        }
      ],
      'typescript/no-explicit-any': 'error',
      'typescript/no-inferrable-types': 'off',
      'typescript/no-non-null-assertion': 'error',
      'typescript/no-parameter-properties': 'error',
      'typescript/no-triple-slash-reference': 'error',
      'typescript/no-type-alias': [
        'error',
        {
          'allowAliases': 'always'
        }
      ],
      'typescript/no-unused-vars': 'error',
      'typescript/no-use-before-define': [
        'error',
        {
          'functions': true,
          'classes': true,
          'variables': true,
          'typedefs': true
        }
      ],
      'typescript/no-var-requires': 'error',
      'typescript/prefer-namespace-keyword': 'off',
      'typescript/type-annotation-spacing': {
        'before': false,
        'after': true
      }
    }
  }
}
