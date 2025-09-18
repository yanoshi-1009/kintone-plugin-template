const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const manifestJson = path.join(__dirname, "../manifest.json");
const manifestProdJson = path.join(__dirname, "../manifest.prod.json");
const manifestDevJson = path.join(__dirname, "../manifest.dev.json");

if (fs.existsSync(manifestDevJson)) {
  if (fs.existsSync(manifestJson)) {
    fs.renameSync(manifestJson, manifestProdJson);
    console.log("Renamed manifest.json to manifest.prod.json");
  }
  fs.renameSync(manifestDevJson, manifestJson);
  console.log("Renamed manifest.dev.json to manifest.json");
}

try {
  execSync("tsc", { stdio: "inherit" });
  execSync("kintone-plugin-packer --ppk plugin.key --out ./dist/plugin.zip .", {
    stdio: "inherit"
  });
  execSync("node ./scripts/esbuild/build.mjs --mode=development", {
    stdio: "inherit"
  });
} catch (error) {
  process.exit(error.status || 1);
}
