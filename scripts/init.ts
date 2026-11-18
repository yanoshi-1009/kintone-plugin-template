import { execSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const createCertificate = () => {
  mkdirSync(join(rootDir, ".cert"), { recursive: true });
  execSync(
    "mkcert -key-file .cert/private.key -cert-file .cert/private.cert localhost 127.0.0.1",
    { cwd: rootDir, stdio: "inherit" }
  );
};

const installDependencies = () => {
  execSync("pnpm install", { cwd: rootDir, stdio: "inherit" });
};

const createPrivateKey = () => {
  execSync("cli-kintone plugin keygen --output private.ppk", {
    cwd: rootDir,
    stdio: "inherit"
  });
};

// Template-only files. src/**/.gitkeep must stay: they keep the empty directories tracked.
const removeTemplateFiles = () => {
  const targets = ["renovate.json", "LICENSE"].map((file) =>
    join(rootDir, file)
  );

  for (const target of targets) {
    if (!existsSync(target)) {
      console.log(`Not found: ${target}`);
      continue;
    }
    unlinkSync(target);
    console.log(`Deleted: ${target}`);
  }
};

const main = () => {
  try {
    createCertificate();
    installDependencies();
    createPrivateKey();
  } catch (error: unknown) {
    console.error("\x1b[31mError during initialization:\x1b[0m", error);
    process.exitCode = 1;
    return;
  }

  try {
    removeTemplateFiles();
  } catch (error: unknown) {
    console.error(
      "\x1b[33mWarning: failed to remove template files.\x1b[0m",
      error
    );
  }

  console.log("\x1b[32mInitialization completed successfully.\x1b[0m");
};

main();
