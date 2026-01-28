const { execSync } = require("child_process");

try {
  execSync(
    "cli-kintone plugin upload --input ./dist/plugin.zip --watch",
    { stdio: "inherit" }
  );
} catch (error) {
  process.exit(error.status || 1);
}
