import cybozuEslintConfig from "@cybozu/eslint-config/presets/typescript-prettier";

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
