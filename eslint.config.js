import cybozuEslintConfig from "@cybozu/eslint-config/flat/presets/node-prettier.js";

export default [...cybozuEslintConfig, { ignore: ["node_modules", "dist"] }];
