import type { Plugin } from "esbuild";

const serveModePlugin: Plugin = {
  name: "serve-mode-plugin",
  setup(build) {
    let startTime: Date | null = null;
    build.onStart(() => {
      startTime = new Date();
      console.log("------");
      console.log(`${startTime.toLocaleString()} Build started`);
    });
    build.onEnd(() => {
      const endTime = new Date();
      const duration =
        (endTime.getTime() - (startTime?.getTime() ?? endTime.getTime())) /
        1000;
      console.log(
        `${endTime.toLocaleString()} Build finished in ${duration} seconds`
      );
      startTime = null;
    });
  }
};

export default serveModePlugin;
