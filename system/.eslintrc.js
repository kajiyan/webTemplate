module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'typescript',
    'plugin:prettier/recommended'
  ],
  'plugins': ['prettier'],
  'rules': {
    'prettier/prettier': [
      'error',
      {
        'printWidth': 120,
        'singleQuote': true
      }
    ],
    'curly': 'off',
    'comma-dangle': ['error', 'never'],
    'comma-style': ['error', 'last'],
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
    'semi': ['error', 'always']
  },
  'overrides': {
    'files': ['**/*.ts', '**/*.tsx'],
    'parser': 'typescript-eslint-parser',
    'plugins': ['typescript', 'prettier'],
    'rules': {
      'typescript/class-name-casing': true,
      'typescript/interface-name-prefix': true,
      'typescript/explicit-member-accessibility': true,
      'typescript/member-ordering': [
        true, {
          'public-before-private': true,
          'static-before-instance': true,
          'variables-before-functions': true
        }
      ],
      'typescript/no-inferrable-types': false,
      'typescript/prefer-namespace-keyword': true
    }
  }
}
