module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.eslint.json",
  },
  env: {
    es2020: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    eqeqeq: "error",
    "no-param-reassign": "error",
    "object-shorthand": ["error", "always"],
    "prefer-template": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-explicit-any": "error",
  },
  ignorePatterns: ["node_modules/**", "dist/**", "examples/**", "**/*.js"],
};
