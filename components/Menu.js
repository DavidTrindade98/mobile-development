import Button from "./Button.js";
import Component from "./Component.js";
import ListButton from "./ListButton.js";
import ToggleButton from "./ToggleButton.js";

export default class Menu extends Component {
  #menuData;
  #menuContainer;
  #menuButton;
  #backButton;
  #currentList = null;
  #isOpen = false;

  constructor(elementId, callback) {
    super(elementId, callback);

    this.#menuButton = new ToggleButton("#menu-button", (value) => {
      this.#isOpen ? this.close() : this.open();
    });

    this.#backButton = new Button("#menu-back-button", (value) => {
      const index = this.#menuContainer.children.length - 1;
      this.#deleteList(index);
    });

    this.#menuContainer = this.element.querySelector("#menu-container");
  }

  #createList(data) {
    const ul = document.createElement("ul");

    data.forEach((itemData) => {
      const listButton = new ListButton(itemData, () => {
        if (itemData.type === "folder") {
          this.#createList(itemData.children);
        } else {
          this.callback(itemData);
        }
      });
      ul.appendChild(listButton.element);
    });

    if (this.#currentList) {
      this.#currentList.style.transform = "translateX(-100%)";
    }
    this.#menuContainer.appendChild(ul);
    this.#currentList = ul;

    setTimeout(() => {
      this.#currentList.style.transform = "translateX(0)";
    }, 10);
    this.#backButton.displayed = this.#menuContainer.children.length > 1;
  }

  #deleteList(index = null) {
    if (index !== null) {
      const list = this.#menuContainer.children[index];
      list.style.transform = "translateX(100%)";
      this.#currentList = this.#menuContainer.children[index - 1];
      this.#currentList.style.transform = "translateX(0)";

      this.#menuContainer.children.length - 1 > 1
        ? (this.#backButton.displayed = true)
        : (this.#backButton.displayed = false);
      setTimeout(() => {
        this.#menuContainer.removeChild(list);
      }, this.SPEED);
    } else {
      this.#menuContainer.innerHTML = "";
      this.#currentList = null;
      this.#backButton.displayed = false;
    }
  }

  open() {
    this.#menuButton.toggle(1);
    this.#menuContainer.style.transform = "scaleY(1)";
    this.callback({ type: "opening" });

    setTimeout(() => {
      this.#createList(this.#menuData);
    }, this.SPEED);
    this.#isOpen = true;
  }

  close() {
    this.#menuButton.toggle(0);
    this.#deleteList();
    this.#menuContainer.style.transform = "scaleY(0)";
    this.#isOpen = false;
  }

  setTrail(trail) {
    if (!this.#isOpen) return;
    console.log(trail);
  }

  get data() {
    return this.#menuData;
  }

  set data(val) {
    this.#menuData = val;
    //if opened, paint trail.
  }
}
