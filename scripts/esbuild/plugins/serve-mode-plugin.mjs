export default {
  name: "serve-mode-plugin",
  setup(build) {
    let startTime = "";
    build.onStart(() => {
      startTime = new Date();
      console.log("------");
      console.log(`${startTime.toLocaleString()} Build started`);
    });
    build.onEnd(() => {
      const endTime = new Date();
      const duration = (endTime - startTime) / 1000;
      console.log(
        `${endTime.toLocaleString()} Build finished in ${duration} seconds`
      );
      startTime = "";
    });
  }
};
