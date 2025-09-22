import { Button, Spinner, Notification } from "kintone-ui-component";
import { classNames, ids } from "../common/config/constants";
import i18n from "../common/i18n/i18n";

((PLUGIN_ID: string) => {
  "use strict";
  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  console.log(CONFIG);

  const cancelButton = new Button({
    text: i18n.t("config.label.cancel"),
    type: "normal",
    className: classNames.cancelButton
  });

  cancelButton.addEventListener("click", () => {
    history.back();
  });

  const saveButton = new Button({
    text: i18n.t("config.label.save"),
    type: "submit",
    className: classNames.saveButton
  });

  saveButton.addEventListener("click", async () => {
    const newConfig = {};
    kintone.plugin.app.setConfig(newConfig);
  });

  const settingFooter = document.getElementById(
    ids.configFooter
  ) as HTMLDivElement;
  settingFooter.appendChild(cancelButton);
  settingFooter.appendChild(saveButton);

  // Main
  const notification = new Notification({
    type: "danger"
  });
  const spinner = new Spinner();
  spinner.open();
  try {
    // foo()
  } catch (error) {
    notification.text = (error as Error).message;
    notification.open();
    console.error(error);
  } finally {
    spinner.close();
  }
})(kintone.$PLUGIN_ID);
