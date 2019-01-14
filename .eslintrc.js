module.exports = {
  extends: "@cybozu/eslint-config/presets/prettier",
  globals: {
    kintone: true
  },
  env: {},
  rules: {
    "vars-on-top": ["off"]
  }
};
