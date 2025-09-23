import { Button } from "kintone-ui-component";
import i18n from "../../common/i18n/i18n";

export default class {
  #saveButton = new Button({
    text: i18n.t("config.label.save"),
    type: "submit"
  });
  #cancelButton = new Button({
    text: i18n.t("config.label.cancel"),
    type: "normal"
  });
  constructor(onSaveClick: () => void) {
    this.#saveButton.addEventListener("click", onSaveClick);
    this.#cancelButton.addEventListener("click", () => {
      history.back();
    });
  }

  appendTo(element: HTMLElement) {
    element.appendChild(this.#cancelButton);
    element.appendChild(this.#saveButton);
  }
}
