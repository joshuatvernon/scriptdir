module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'jest', 'import', 'simple-import-sort'],
  rules: {
    /*
    ESLint:       https://eslint.org/docs/rules/
    TS-ESLint:    https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
    */
    curly: ['error', 'all'],
    // Require semicolons at the end of statements
    semi: ['error', 'always'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'object-shorthand': ['error', 'always'],
    // Error when prettier rules are violated
    'prettier/prettier': 'error',
    // Enforce maximum number of consecutive empty lines
    'no-multiple-empty-lines': ['error', { max: 1 }],
    // Don't allow dangling underscores
    'no-underscore-dangle': [2, { allow: [] }],
    // Disallow empty lines at the beginning and ending of block statements and classes
    'padded-blocks': ['error', 'never'],
    // Prevent disabled tests
    'jest/no-disabled-tests': 'error',
    // Use toHaveLength in tests
    'jest/prefer-to-have-length': 'error',
    // Verifies that all named imports are part of the set of named exports in the referenced module
    'import/named': 'error',
    // Ensure consistent use of file extension within the import path
    'import/extensions': ['error', 'never'],
    // Enforce sorting of import statements
    'simple-import-sort/sort': 'error'
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'simple-import-sort/sort': [
          'error',
          {
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // Absolute imports and other imports such as Vue-style `@/foo`.
              // Anything that does not start with a dot.
              ['^[^.]'],
              // Packages.
              // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
              ['^@?\\w'],
              // Relative imports.
              // Anything that starts with a dot.
              ['^\\.'],
              // Style imports.
              ['^.+\\.s?css$']
            ]
          }
        ]
      }
    }
  ]
};
