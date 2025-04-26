import {defineConfig, globalIgnores} from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const commonRules = {
  'semi': ['error', 'always'],
  'quotes': ['error', 'single'],
  'indent': ['error', 2],
  'consistent-return': 'error',
  'max-len': ['error', {code: 120}],
  'no-console': ['warn', {allow: ['warn', 'error']}],
  'no-unused-vars': 'off',
  'no-duplicate-imports': 'off',
  'no-var': 'error',
  'prefer-const': 'error',
  'eqeqeq': ['error', 'always'],
  'curly': ['error', 'all'],
  'promise/catch-or-return': 'error',
  'object-curly-spacing': ['error', 'never'],
  'import/order': [
    'error',
    {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      'alphabetize': {order: 'asc', caseInsensitive: true}
    }
  ]
};

const typescriptRules = {
  '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
  '@typescript-eslint/explicit-function-return-type': ['warn', {allowExpressions: true}],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/consistent-type-imports': 'warn'
};

const typescriptTypeCheckingRules = {
  '@typescript-eslint/no-unsafe-argument': 'warn',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'warn'
  
};

export default defineConfig([
  globalIgnores([
    'dist/**/*',
    'node_modules/**/*',
    '**/*.js',
    '**/*.d.ts',
    'coverage/**/*',
    'tests/**/*',
  ]),

  {
    files: ['**/*.ts', '**/*.mts'],
    extends: compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'plugin:promise/recommended'),
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'import': importPlugin,
      'promise': promisePlugin
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      ...commonRules,
      ...typescriptRules,
    },
  },

  {
    files: ['**/*.ts', '**/*.mts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...typescriptTypeCheckingRules,
    },
  },

  {
    files: ['client/**/*.ts'],
    languageOptions: {
      globals: {
        window: true,
        document: true,
        localStorage: true,
        fetch: true,
      },
    },
  },

  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: {
        process: true,
      },
    },
  },
]);
