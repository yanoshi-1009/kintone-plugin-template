import { execSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const manifestJson = join(__dirname, "../manifest.json");
const manifestProdJson = join(__dirname, "../manifest.prod.json");
const manifestDevJson = join(__dirname, "../manifest.dev.json");

if (existsSync(manifestDevJson)) {
  if (existsSync(manifestJson)) {
    renameSync(manifestJson, manifestProdJson);
    console.log("Renamed manifest.json to manifest.prod.json");
  }
  renameSync(manifestDevJson, manifestJson);
  console.log("Renamed manifest.dev.json to manifest.json");
}

try {
  execSync("tsc", { stdio: "inherit" });
  execSync(
    "cli-kintone plugin pack --input ./manifest.json --output ./dist/plugin.zip --private-key ./private.ppk",
    { stdio: "inherit" }
  );
  execSync("node ./scripts/esbuild/build.ts --mode=development", {
    stdio: "inherit"
  });
} catch (error) {
  process.exit((error as { status?: number | null }).status ?? 1);
}
