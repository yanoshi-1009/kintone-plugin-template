import { Button, Notification } from "kintone-ui-component";
import i18n from "../../common/i18n/i18n";
export default class PluginFooterBuilder {
  #saveButton = new Button({
    text: i18n.t("config.label.save"),
    type: "submit"
  });
  #cancelButton = new Button({
    text: i18n.t("config.label.cancel"),
    type: "normal"
  });

  constructor(onSave: () => Promise<void>) {
    this.#saveButton.addEventListener("click", async () => {
      try {
        await onSave();
        history.back();
      } catch (error) {
        console.error(error);
        const notification = new Notification({
          type: "danger",
          text: (error as Error).message
        });
        notification.open();
      }
    });
    this.#cancelButton.addEventListener("click", () => {
      history.back();
    });
  }

  appendTo(element: HTMLElement) {
    element.appendChild(this.#cancelButton);
    element.appendChild(this.#saveButton);
  }
}
