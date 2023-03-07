import Component from "./Component.js";

export default class PeekABoo extends Component {
  #timeoutID = null;
  #TIMEOUT = 2500;
  constructor(elemID) {
    super(elemID);
  }

  show(message = "", type = "success") {
    if (this.#timeoutID) this.hide();

    let color = "transparent";
    this.element.style.backgroundColor = "transparent";
    switch (type) {
      case "success":
        color = "var(--success-color)";
        break;
      case "warning":
        color = "var(--warning-color)";
        break;
      case "error":
        color = "var(--error-color)";
        break;
    }
    this.element.style.backgroundColor = color;

    requestAnimationFrame(() => {
      this.element.innerText = message;
      this.element.style.animationName = "peekaboo";
      this.#timeoutID = setTimeout(() => {
        this.hide();
      }, this.#TIMEOUT);
    });
  }
  hide() {
    if (this.#timeoutID) clearTimeout(this.#timeoutID);
    this.#timeoutID = null;
    this.element.innerText = "";
    this.element.style.animationName = "";
  }
}
