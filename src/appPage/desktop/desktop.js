((PLUGIN_ID) => {
  "use strict";
  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  console.log(CONFIG);
  kintone.events.on("app.record.index.show", (event) => {
    alert("Hello, Kintone!");
  });
})(kintone.$PLUGIN_ID);
