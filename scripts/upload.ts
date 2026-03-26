import { execSync } from "node:child_process";

try {
  execSync("cli-kintone plugin upload --input ./dist/plugin.zip --watch", {
    stdio: "inherit"
  });
} catch (error) {
  process.exit((error as { status?: number | null }).status ?? 1);
}
