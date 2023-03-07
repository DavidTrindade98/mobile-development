export default class Component {
  element;
  callback;
  SPEED = 0;

  constructor(elementID = null, callback = () => {}) {
    this.element = document.querySelector(elementID);
    this.callback = callback;

    this.SPEED =
      parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--speed")
          .replace(/(ms|s)/g, "")
      ) * 1000;
  }

  setElement(element) {
    this.element = element;
  }

  get displayed() {
    return this.element.style.display === "initial";
  }
  set displayed(value) {
    let display;
    value ? (display = "initial") : (display = "none");
    this.element.style.display = display;
  }
}
