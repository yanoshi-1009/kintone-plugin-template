import { Spinner, Notification } from "kintone-ui-component";
import { ids } from "../common/config/constants";
import type { PluginConfig } from "../common/types/PluginConfig";
import PluginFooterBuilder from "./components/PluginFooterBuilder";

((PLUGIN_ID: string) => {
  "use strict";
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  console.log("Current config: ", config);

  const settingFooterDiv = document.getElementById(
    ids.configFooter
  ) as HTMLDivElement;
  const footer = new PluginFooterBuilder(async () => {
    const newConfig: PluginConfig = {};
    await new Promise((resolve) => {
      kintone.plugin.app.setConfig(newConfig, () => {
        resolve("success");
      });
    });
  });
  footer.appendTo(settingFooterDiv);

  const notification = new Notification({
    type: "danger"
  });
  const spinner = new Spinner();
  spinner.open();
  try {
    // Main process of config page
  } catch (error) {
    notification.text = (error as Error).message;
    notification.open();
    console.error(error);
  } finally {
    spinner.close();
  }
})(kintone.$PLUGIN_ID);
