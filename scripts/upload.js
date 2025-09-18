const { execSync } = require("child_process");

try {
  execSync(
    "kintone-plugin-uploader dist/plugin.zip --watch --waiting-dialog-ms 3000",
    { stdio: "inherit" }
  );
} catch (error) {
  process.exit(error.status || 1);
}
