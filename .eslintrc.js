// .eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", // TypeScript 코드를 분석하기 위한 파서
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // Prettier와 충돌하는 ESLint 규칙을 끔
  ],
  rules: {
    "prettier/prettier": "error", // Prettier 규칙에 맞지 않으면 ESLint 오류로 표시
  },
};
