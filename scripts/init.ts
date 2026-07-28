import { execSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

try {
  mkdirSync(".cert", { recursive: true });
  execSync(
    "mkcert -key-file .cert/private.key -cert-file .cert/private.cert localhost 127.0.0.1",
    { stdio: "inherit" }
  );
  execSync("pnpm install", { stdio: "inherit" });
  execSync("cli-kintone plugin keygen --output private.ppk", {
    stdio: "inherit"
  });
} catch (error: unknown) {
  console.error("\x1b[31mError during initialization:\x1b[0m", error);
  throw error;
}

// Template-only files that a project generated from this template does not need.
const targets = [join(import.meta.dirname, "../renovate.json")];

for (const file of targets) {
  if (existsSync(file)) {
    unlinkSync(file);
    console.log(`Deleted: ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
}
