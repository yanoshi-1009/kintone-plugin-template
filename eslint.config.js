import cybozuEslintConfig from "@cybozu/eslint-config/presets/node-typescript-prettier";

export default [
  ...cybozuEslintConfig,
  { ignores: ["node_modules", "dist"] },
  { rules: { "n/no-unpublished-import": "off" } }
];
