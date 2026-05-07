import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

const rules = {
  'no-debugger': 'warn',
  'no-console': 'warn',
  quotes: ['error', 'single', { avoidEscape: true }],
  'quote-props': ['warn', 'as-needed'],
  'comma-dangle': ['error', 'only-multiline'],
  camelcase: ['error', { properties: 'never' }],

  'array-bracket-spacing': 'warn',
  'arrow-spacing': 'warn',
  'block-spacing': 'warn',
  'comma-spacing': 'warn',
  'computed-property-spacing': 'warn',
  'generator-star-spacing': 'warn',
  'key-spacing': 'warn',
  'keyword-spacing': 'warn',
  'object-curly-spacing': ['warn', 'always'],
  'rest-spread-spacing': 'warn',
  'switch-colon-spacing': 'error',
  'func-call-spacing': 'off',
  'semi-spacing': 'warn',
  'template-curly-spacing': 'warn',
  'template-tag-spacing': 'warn',
  'yield-star-spacing': 'warn',
  'space-unary-ops': 'warn',
  'no-multi-spaces': 'warn',
  'no-mixed-spaces-and-tabs': 'warn',
  'no-trailing-spaces': 'warn',
  'spaced-comment': 'warn',
  'space-infix-ops': 'warn',
  'space-in-parens': 'warn',

  'eol-last': 'warn',
  indent: ['warn', 2, { SwitchCase: 1 }],

  semi: ['warn', 'always'],
  'prefer-template': 'error',
  'prefer-spread': 'error',
  'no-var': 'error',
  'max-lines-per-function': [
    'warn',
    {
      max: 100,
      skipComments: true,
      skipBlankLines: true,
    },
  ],
  complexity: ['warn', 20],
  'max-depth': ['warn', 4],
  'max-len': [
    'warn',
    {
      code: 160,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignorePattern: 'd="([\\s\\S]*?)"',
      ignoreComments: true,
    },
  ],
  'default-param-last': 'off',
  'no-param-reassign': ['error', { props: false }],
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
  'no-redeclare': 'off', // off以支持类型重载
  'no-use-before-define': ['error', { functions: false }],

  'no-unused-vars': 'off',
  'no-undef-init': 'warn',

  /** **********  eslint-plugin-vue *******************/
  'vue/no-unused-vars': [
    'warn',
    {
      ignorePattern: '^_',
    },
  ],
  'vue/max-attributes-per-line': [
    'warn',
    {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 1,
      },
    },
  ],
  'vue/first-attribute-linebreak': [
    'warn',
    {
      singleline: 'ignore',
      multiline: 'below',
    },
  ],
  'vue/html-closing-bracket-newline': [
    'warn',
    {
      singleline: 'never',
      multiline: 'always',
    },
  ],
  'vue/html-indent': [
    'warn',
    2,
    {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    },
  ],
  // 允许通过多语言t函数插入（内部数据，无xss风险）
  'vue/no-v-html': [
    'error',
    {
      ignorePattern: '^html|^t(.*)',
    },
  ],

  /** **********  typescript-eslint *******************/
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      args: 'all',
      argsIgnorePattern: '^_',
      caughtErrors: 'all',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ],
  '@typescript-eslint/no-empty-object-type': [
    'warn',
    {
      allowInterfaces: 'with-single-extends',
    },
  ],
};
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
    rules,
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      'no-undef': 'off',
    },
  },
  tseslint.configs.base,
  pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
      globals: {
        ...globals.browser,
        ScrollBehavior: 'readonly',
        ScrollToOptions: 'readonly',
        IntersectionObserverInit: 'readonly',
      },
    },
    rules,
  },
  eslintPrettier,
]);
