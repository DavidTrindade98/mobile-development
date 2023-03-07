import Component from "./Component.js";

export default class Button extends Component {
  #wait_click = false;
  constructor(elemID, callback) {
    super(elemID, callback);

    if (this.element) {
      this.#setupEvents();
    }
  }

  #setupEvents() {
    this.element.onclick = () => {
      if (this.#wait_click) return;
      this.callback();
      this.#wait_click = true;
      setTimeout(() => {
        this.#wait_click = false;
      }, this.SPEED);
    };
  }

  setElement(element) {
    super.setElement(element);
    this.#setupEvents();
  }

  get text() {
    return this.element.querySelector("label").innerText;
  }
  set text(val) {
    this.element.querySelector("label").innerText = val;
  }

  get color() {
    return this.element.querySelector("label").style.color;
  }
  set color(val) {
    this.element.querySelector("label").style.color = val;
  }
}
