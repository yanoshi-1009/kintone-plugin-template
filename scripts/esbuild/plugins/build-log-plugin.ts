import type { Plugin } from "esbuild";

const buildLogPlugin: Plugin = {
  name: "build-log",
  setup(build) {
    let startTime: number | null = null;

    build.onStart(() => {
      startTime = Date.now();
      console.log("------");
      console.log(`${new Date(startTime).toLocaleString()} Build started`);
    });

    build.onEnd((result) => {
      const endTime = Date.now();
      const duration = (endTime - (startTime ?? endTime)) / 1000;
      startTime = null;

      if (result.errors.length > 0) {
        console.log(
          `\x1b[31m${new Date(endTime).toLocaleString()} Build failed with ${result.errors.length} error(s) in ${duration} seconds\x1b[0m`
        );
        return;
      }
      console.log(
        `${new Date(endTime).toLocaleString()} Build finished in ${duration} seconds`
      );
    });
  }
};

export default buildLogPlugin;
