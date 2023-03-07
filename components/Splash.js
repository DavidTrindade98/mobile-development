export default class Splash {
  #element;
  #label;
  #icon;
  #MESSAGES = ["Loading, please wait...", "Still loading, hang on!", "Loading, zzzz..."];
  #intervalID = null;

  constructor() {
    this.#element = document.querySelector("#splash");
    this.#label = this.#element.querySelector("p");
    this.#icon = this.#element.querySelector("path");

    let counter = 0;
    this.#label.innerText = this.#MESSAGES[counter];
    this.#intervalID = setInterval(() => {
      counter++;
      if (counter >= this.#MESSAGES.length) counter = 0;
      this.#label.innerText = this.#MESSAGES[counter];
    }, 5000);
  }

  error() {
    clearInterval(this.#intervalID);
    this.#intervalID = null;

    this.#icon.style.animationName = "none";
    this.#icon.style.fill = "var(--error-color)";
    this.#label.innerText = "Error connecting to server.";
    this.#label.style.color = "var(--error-color)";
  }

  delete() {
    clearInterval(this.#intervalID);
    this.#intervalID = null;

    this.#icon.style.animationName = "none";
    this.#label.innerText = "App loaded!";
    setTimeout(() => {
      document.body.removeChild(this.#element);
    }, 1000);
  }
}
