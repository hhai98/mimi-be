module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    amd: true,
    browser: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',

    'prefer-promise-reject-errors': 'off',

    quotes: ['warn', 'single', { avoidEscape: true }],

    // this rule, if on, would require explicit return type on the `render` function
    '@typescript-eslint/explicit-function-return-type': 'off',

    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    '@typescript-eslint/no-var-requires': 'error',

    // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
    // does not work with type definitions
    'no-unused-vars': 'error',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: null,
        selector: 'default',
      },
      {
        format: ['camelCase', 'snake_case', 'PascalCase'],
        leadingUnderscore: 'forbid',
        selector: 'variable',
      },
      {
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        selector: 'parameter',
      },
      {
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        selector: 'typeLike',
      },
      {
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'forbid',
        selector: ['function', 'method'],
      },
      {
        format: ['UPPER_CASE'],
        leadingUnderscore: 'forbid',
        selector: 'enum',
      },
      {
        format: ["PascalCase"],
        leadingUnderscore: 'forbid',
        prefix: ["I"],
        selector: "interface",
      }
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        minimumDescriptionLength: 3,
        'ts-check': false,
        'ts-expect-error': { descriptionFormat: '^: TS\\d+ because .+$' },
        'ts-ignore': { descriptionFormat: '^: TS\\d+ because .+$' },
        'ts-nocheck': { descriptionFormat: '^: TS\\d+ because .+$' },
      },
    ],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['.*'],
      },
    ],
    'no-unreachable': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'require-await': 'error',
    // 'simple-import-sort/exports': 'error',
    // 'simple-import-sort/imports': 'error',
    // 'sort-keys-fix/sort-keys-fix': 'error',
    // 'typescript-sort-keys/interface': [
    //   'error',
    //   'asc',
    //   { caseSensitive: true, natural: false, requiredFirst: true },
    // ],
  },
};
