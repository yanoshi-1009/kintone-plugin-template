import { execSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const manifestJson = join(__dirname, "../manifest.json");
const manifestProdJson = join(__dirname, "../manifest.prod.json");
const manifestDevJson = join(__dirname, "../manifest.dev.json");

if (existsSync(manifestProdJson)) {
  if (existsSync(manifestJson)) {
    renameSync(manifestJson, manifestDevJson);
    console.log("Renamed manifest.json to manifest.dev.json");
  }
  renameSync(manifestProdJson, manifestJson);
  console.log("Renamed manifest.prod.json to manifest.json");
}

try {
  execSync("tsc", { stdio: "inherit" });
  execSync("node ./scripts/esbuild/build.ts --mode=production", {
    stdio: "inherit"
  });
  execSync(
    "cli-kintone plugin pack --input ./manifest.json --output ./dist/plugin.zip --private-key ./private.ppk",
    { stdio: "inherit" }
  );
} catch (error) {
  process.exit((error as { status?: number | null }).status ?? 1);
}
