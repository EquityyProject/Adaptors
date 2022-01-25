// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
}
