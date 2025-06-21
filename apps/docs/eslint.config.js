import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/** @satisfies {import("eslint").Linter.Config[]} */
export default [
  {
    files: ['src/.vitepress/**/*.{js,ts,vue}'],
    ignores: ['*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // add any global variables here if needed
      },
      env: {
        node: true,
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...vue.configs['vue3-essential'].rules,
      ...tseslint.configs.recommended.rules,
      ...prettier.rules,
    },
  },
];
