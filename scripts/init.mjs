import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  execSync("mkdir -p .cert", { stdio: "inherit" });
  execSync(
    "mkcert -key-file .cert/private.key -cert-file .cert/private.cert localhost 127.0.0.1",
    { stdio: "inherit" }
  );
  execSync("pnpm install", { stdio: "inherit" });
  execSync("cli-kintone plugin keygen --output private.ppk", {
    stdio: "inherit"
  });
} catch (error) {
  process.exit(error.status || 1);
}

const targets = [
  join(__dirname, "../renovate.json"),
  join(__dirname, "../.gitkeep")
];

for (const file of targets) {
  if (existsSync(file)) {
    unlinkSync(file);
    console.log(`Deleted: ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
}
