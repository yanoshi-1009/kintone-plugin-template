import { type Config } from "prettier";

const config: Config = {
  // to avoid JSON.parse error
  trailingComma: "none"
};

export default config;
