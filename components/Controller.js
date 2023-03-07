import Button from "./Button.js";
import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Controller extends Component {
  currentState = "pause";
  // #previousButton;
  #actionButton;
  // #nextButton;
  constructor(elemID, callback) {
    super(elemID, callback);

    const previousButton = new Button("#previous-button", (value) => {
      this.callback("previous");
    });

    this.#actionButton = new ToggleButton("#action-button", (value) => {
      if (this.currentState === "loading") return;
      this.currentState === "pause" ? this.callback("play") : this.callback("pause");
    });

    const nextButton = new Button("#next-button", (value) => {
      this.callback("next");
    });
  }

  setState(state) {
    this.currentState = state;
    let val = 0;
    switch (this.currentState) {
      case "play":
        val = 1;
        break;
      case "pause":
        val = 0;
        break;
      case "loading":
        val = 2;
        break;
      case "error":
        val = 3;
        break;
    }
    this.#actionButton.toggle(val);
  }
}
