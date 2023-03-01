import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Info extends Component {
  #infoContainer;
  #infoButton;
  #isOpened = false;

  constructor(elemID, callback) {
    super(elemID, callback);

    this.#infoContainer = this.element.querySelector("#info-container");
    this.#infoButton = new ToggleButton("#info-button", (value) => {
      this.#isOpened ? this.close() : this.open();
      this.callback(this.#isOpened);
    });
  }

  open() {
    if (this.#isOpened) return;
    this.#infoContainer.style.transform = "scaleY(1)";
    this.#infoButton.toggle(1);
    this.#isOpened = true;
  }

  close() {
    if (!this.#isOpened) return;
    this.#infoContainer.style.transform = "scaleY(0)";
    this.#infoButton.toggle(0);
    this.#isOpened = false;
  }

  update(data) {
    this.#infoButton.text = data.name;
    this.#infoButton.color =
      data.type === "error" ? "var(--error-color)" : "var(--primary-color)";
  }
}
