import Component from "./Component.js";

export default class RangeBar extends Component {
  #rangeInput;
  #rangeBar;

  constructor(elemID = null, callback) {
    super(elemID, callback);

    this.#rangeInput = this.element.querySelector("input[type='range']");
    this.#rangeBar = this.element.querySelector(".range-bar");

    this.#rangeInput.oninput = () => {
      this.value = this.#rangeInput.value;

      this.callback(this.value);
    };
  }

  get value() {
    return parseFloat(this.#rangeInput.value);
  }

  set value(value) {
    this.#rangeBar.style.transform = `scaleX(${value / 100})`;
  }
}
