import * as esbuild from "esbuild";
import { parseArgs } from "node:util";
import serveModePlugin from "./plugins/serve-mode-plugin.ts";

/**
 * Keep in sync with the https URLs in manifest.json — that manifest points
 * kintone at this dev server, and `servedir` below is what backs those paths.
 */
const DEV_SERVER_HOST = "localhost";
const DEV_SERVER_PORT = 9000;
const OUT_DIR = "dist";

const {
  values: { mode = "development" }
} = parseArgs({
  options: {
    mode: {
      type: "string",
      default: "development"
    }
  },
  allowPositionals: false
});

if (mode !== "production" && mode !== "development") {
  console.error(
    "\x1b[31mError: Please specify the mode as 'production' or 'development'.\x1b[0m"
  );
  throw new Error("Invalid mode specified. Use 'production' or 'development'.");
}

// CSS is a separate entry point rather than an import from the TypeScript
// bundles: kintone loads a plugin's stylesheets in <head> before the scripts
// run, so shipping them as real .css files avoids the flash of unstyled content
// that runtime style injection would cause. The manifest also declares desktop,
// mobile and config CSS independently, so the three outputs are required.
const context = await esbuild.context({
  entryPoints: [
    "src/appPage/desktop/desktop.ts",
    "src/appPage/desktop/desktop.css",
    "src/appPage/mobile/mobile.ts",
    "src/appPage/mobile/mobile.css",
    "src/configPage/config.ts",
    "src/configPage/config.css"
  ],
  bundle: true,
  sourcemap: mode === "production" ? false : "inline",
  minify: mode === "production",
  legalComments: mode === "production" ? "eof" : "none",
  outdir: OUT_DIR,
  plugins: [serveModePlugin]
});

const runServeMode = async (): Promise<void> => {
  try {
    await context.rebuild();
    const serveResult = await context.serve({
      host: DEV_SERVER_HOST,
      port: DEV_SERVER_PORT,
      servedir: OUT_DIR,
      keyfile: ".cert/private.key",
      certfile: ".cert/private.cert"
    });

    console.log("\x1b[36m========================================\x1b[0m");
    console.log(
      `\x1b[32m🚀 Server is running at: \x1b[1m\x1b[4mhttps://${DEV_SERVER_HOST}:${serveResult.port}\x1b[0m`
    );
    console.log("\x1b[36m========================================\x1b[0m");
  } catch (error) {
    console.error("\x1b[31mError during watch mode:\x1b[0m", error);
    throw error;
  }
};

const runProductionBuild = async (): Promise<void> => {
  try {
    await context.rebuild();
    console.log("\x1b[32mProduction build completed successfully.\x1b[0m");
  } catch (error) {
    console.error("\x1b[31mError during production build:\x1b[0m", error);
    process.exitCode = 1;
  } finally {
    // Releases esbuild's child process so the command exits on its own. The
    // serve path deliberately keeps the context alive instead.
    await context.dispose();
  }
};

switch (mode) {
  case "development":
    await runServeMode();
    break;
  case "production":
    await runProductionBuild();
}
