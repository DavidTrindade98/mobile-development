import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Info extends Component {
  #infoContainer;
  #infoButton;
  #isOpened = false;

  #nameLabel;
  #typeLabel;
  constructor(elemID, callback) {
    super(elemID, callback);

    this.#infoContainer = this.element.querySelector("#info-container");

    this.#nameLabel = this.#infoContainer.querySelector(".name");
    this.#typeLabel = this.#infoContainer.querySelector(".type");

    this.#infoButton = new ToggleButton("#info-button", (value) => {
      this.#isOpened ? this.close() : this.open();
    });
  }

  update(data) {
    this.#infoButton.text = data.name;
    this.#nameLabel.innerText = data.name;
    this.#typeLabel.innerText = data.type;
    this.#infoButton.color =
      data.type === "error" ? "var(--error-color)" : "var(--primary-color)";
  }

  open() {
    if (this.#isOpened) return;
    this.#infoContainer.style.transform = "scaleY(1)";
    this.#infoButton.toggle(1);
    this.#isOpened = true;

    setTimeout(() => {
      for (let i = 0; i < this.#infoContainer.children.length; i++) {
        const element = this.#infoContainer.children[i];
        element.style.display = "flex";
      }
    }, this.SPEED);
  }
  close() {
    if (!this.#isOpened) return;
    for (let i = 0; i < this.#infoContainer.children.length; i++) {
      const element = this.#infoContainer.children[i];
      element.style.display = "none";
    }
    this.#infoContainer.style.transform = "scaleY(0)";
    this.#infoButton.toggle(0);
    this.#isOpened = false;
  }
}
