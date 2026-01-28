const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const manifestJson = path.join(__dirname, "../manifest.json");
const manifestProdJson = path.join(__dirname, "../manifest.prod.json");
const manifestDevJson = path.join(__dirname, "../manifest.dev.json");

if (fs.existsSync(manifestProdJson)) {
  if (fs.existsSync(manifestJson)) {
    fs.renameSync(manifestJson, manifestDevJson);
    console.log("Renamed manifest.json to manifest.dev.json");
  }
  fs.renameSync(manifestProdJson, manifestJson);
  console.log("Renamed manifest.prod.json to manifest.json");
}

try {
  execSync("tsc", { stdio: "inherit" });
  execSync("node ./scripts/esbuild/build.mjs --mode=production", {
    stdio: "inherit"
  });
  execSync("cli-kintone plugin pack --input ./manifest.json --output ./dist/plugin.zip --private-key ./private.ppk", {
    stdio: "inherit"
  });
} catch (error) {
  process.exit(error.status || 1);
}
