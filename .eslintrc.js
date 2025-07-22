/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
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
    'semi-spacing': 'warn',
    'template-curly-spacing': 'warn',
    'template-tag-spacing': 'warn',
    'yield-star-spacing': 'warn',
    semi: ['warn', 'always'],
    'no-trailing-spaces': 'warn',
    'prefer-template': 'error',
    'prefer-spread': 'error',
    'no-var': 'error',
    'max-lines-per-function': ['error', {
      max: 100,
      skipComments: true,
      skipBlankLines: true
    }],
    complexity: ['warn', 20],
    'max-depth': ['warn', 4],
    'max-len': ['warn', {
      code: 160,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignorePattern: 'd="([\\s\\S]*?)"',
    }],
    'default-param-last': 'off',
    'no-param-reassign': ['error', { props: false }],

    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': ['warn', {
      html: {
        void: 'always',
        normal: 'never',
      },
    }],

    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/multiline-html-element-content-newline': 'warn',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};