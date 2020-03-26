(PLUGIN_ID => {
  'use strict';
  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  console.log(CONFIG);
})(kintone.$PLUGIN_ID);
