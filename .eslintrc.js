var prettierConfig = require('./.prettierrc.js');

module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  overrides: [
    {
      env: {
        browser: true,
        es2021: true
      },
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.app.json', 'e2e/tsconfig.json'],
        createDefaultProgram: true,
        ecmaVersion: 2021,
        sourceType: 'module'
      },
      plugins: ['@typescript-eslint', 'unused-imports', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/recommended',
        'prettier'
      ],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'liv',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'liv',
            style: 'kebab-case'
          }
        ],
        curly: ['error', 'all'],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'all',
            argsIgnorePattern: '^_'
          }
        ],
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/indent': ['warn', 2],
        '@typescript-eslint/space-before-blocks': 'warn',
        '@typescript-eslint/unbound-method': [
          'warn',
          {
            ignoreStatic: true
          }
        ],
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/keyword-spacing': 'error',
        '@typescript-eslint/space-before-function-paren': [
          'error',
          {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
          }
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        'max-len': [
          'error',
          {
            code: 120,
            tabWidth: 4,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreRegExpLiterals: true
          }
        ],
        'max-lines-per-function': [
          'error',
          {
            max: 40,
            skipBlankLines: true,
            skipComments: true
          }
        ],
        'prefer-spread': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'rest-spread-spacing': ['warn'],
        'max-nested-callbacks': ['error', 4],
        'no-trailing-spaces': [
          'error',
          {
            skipBlankLines: true
          }
        ],
        'object-shorthand': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-duplicate-imports': ['error', { includeExports: true }],
        'dot-location': ['error', 'property'],
        'object-curly-spacing': ['error', 'always'],
        'space-infix-ops': 'off',
        eqeqeq: ['error', 'always'],
        'prettier/prettier': ['error', prettierConfig],
        '@typescript-eslint/indent': 'off',
        'function-paren-newline': 'off'
      }
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended']
    }
  ]
};
