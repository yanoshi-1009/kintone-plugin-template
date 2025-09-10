import cybozuEslintConfig from "@cybozu/eslint-config/flat/presets/typescript-prettier.js";

export default [
  ...cybozuEslintConfig,
  {
    languageOptions: {
      globals: {
        kintone: "readonly"
      }
    }
  }
];
