const packageJson = require("./package.json");

module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ];
  const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        version: packageJson.dependencies["@babel/runtime"].replace(/^\^/g, "")
      }
    ],
    [
      "polyfill-corejs3",
      {
        method: "usage-pure",
        version: packageJson.dependencies["core-js-pure"]
          .replace(/^\^/g, "")
          .replace(/.[0-9]+$/g, "")
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
