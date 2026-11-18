import "../../common/i18n";

const PLUGIN_ID = kintone.$PLUGIN_ID;
const config = kintone.plugin.app.getConfig(PLUGIN_ID);
console.log("Current config: ", config);
