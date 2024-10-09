import cybozuEslintConfig from "@cybozu/eslint-config/flat/presets/prettier.js";

export default [
  ...cybozuEslintConfig,
  {
    languageOptions: {
      globals: {
        kintone: "readonly"
      }
    }
  },
  {
    ignores: ["node_modules", "dist", "*.config.js"]
  }
];