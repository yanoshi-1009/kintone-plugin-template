((PLUGIN_ID) => {
  "use strict";
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  console.log("Current config: ", config);
})(kintone.$PLUGIN_ID);
