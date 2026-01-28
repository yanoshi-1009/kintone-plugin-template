const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

try {
  execSync("mkdir .cert", { stdio: "inherit" });
  execSync(
    "openssl req -x509 -newkey rsa:4096 -keyout .cert/private.key -out .cert/private.cert -days 9999 -nodes -subj /CN=127.0.0.1",
    { stdio: "inherit" }
  );
  execSync("pnpm install", { stdio: "inherit" });
  execSync("openssl genrsa -traditional -out plugin.key", { stdio: "inherit" });
} catch (error) {
  process.exit(error.status || 1);
}

const targets = [
  path.join(__dirname, "../renovate.json"),
  path.join(__dirname, "../.gitkeep")
];

for (const file of targets) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted: ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
}
