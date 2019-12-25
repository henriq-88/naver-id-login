module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    `plugin:@typescript-eslint/recommended`
  ],
  rules: {
    'no-console': `off`,
    'no-debugger': process.env.NODE_ENV === `production` ? `error` : `off`,
    'no-unused-vars': `off`,
    quotes: `off`, // disable eslint rule and enable @typescript-eslint rule
    '@typescript-eslint/quotes': [ `error`, `backtick`, { avoidEscape: true } ],
    camelcase: `off`,
    'array-bracket-spacing': [ `error`, `always` ],
    '@typescript-eslint/member-delimiter-style': [ `error`, {
      multiline: {
        delimiter: `none`
      },
      singleline: {
        delimiter: `comma`,
        requireLast: false
      }
    } ],
    '@typescript-eslint/camelcase': `off`,
    '@typescript-eslint/no-explicit-any': `off`
  },
  parserOptions: {
    parser: `@typescript-eslint/parser`
  },
  globals: {
    module: true,
    require: true
  }
}
