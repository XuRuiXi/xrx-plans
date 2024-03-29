module.exports = {
  parser:  '@typescript-eslint/parser',  // 指定ESLint解析器
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended', // 使用来自 @eslint-plugin-react 的推荐规则
    'plugin:@typescript-eslint/recommended',  // 使用来自@typescript-eslint/eslint-plugin的推荐规则
  ],
  // 设置全局变量
  globals: {
    React: 'readonly',
    eruda: 'readonly',
  },
  overrides: [],
  parserOptions: {},
  plugins: [
    'html', // html文件检测
  ],
  rules: {
    "indent": ["error", 2],
    "no-console": 1,
    "no-alert": 1,
    "no-undef": 2, // 使用未定义的变量
    semi: [2, "always"], // 语句强制分号结尾
    "@typescript-eslint/no-inferrable-types": 0, // 简单类型的变量不用声明类型 const a:bumber=12
    "@typescript-eslint/no-var-requires": 0, // 以const module = require()不报错
    "react/prop-types": 0, // 关闭react props的propTypes类型校验
    "@typescript-eslint/no-empty-function": 0, // 关闭空函数报错
  },
};
