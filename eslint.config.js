import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', '.path', 'node_modules']),

  js.configs.recommended,
  ...tseslint.configs.recommended,
  perfectionist.configs['recommended-natural'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'side-effect',
            'style',
            'unknown',
          ],
          order: 'asc',
          type: 'natural',
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'react/prop-types': 'off',
    },
  },

  prettierConfig,
]);
