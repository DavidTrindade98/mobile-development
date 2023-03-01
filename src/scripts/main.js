import AudioPlayer from "../components/AudioPlayer.js";
import Controller from "../components/Controller.js";
import Info from "../components/Info.js";
import Menu from "../components/Menu.js";
import RangeBar from "../components/RangeBar.js";

let appData;
let info;
let controller;
let volumeBar;
let menu;
let fileInput;
let audioPlayer;
  
window.onload = async () => {
  const req = await fetch("app_data.json");
  appData = await req.json();

  setupLayout();
  setupAudio();
};

const setupAudio = () => {
  audioPlayer = new AudioPlayer((state, error) => {
    controller.setState(state);

    switch (state) {
      case "error":
        info.update({
          name: audioPlayer.currentTrack.name,
          type: state,
          error: error,
        });
        break;

      case "play":
        break;

      default:
        break;
    }

    if (state != "error") {
      info.update(audioPlayer.currentTrack);
    }
  });

  audioPlayer.volume = volumeBar.value;
};

const setupLayout = () => {
  info = new Info("#info", (value) => {
    console.log("info", value);
  });

  controller = new Controller("#controller", (value) => {
    console.log("controller", value);
  });

  volumeBar = new RangeBar("#volume", (value) => {
    console.log("volume", value);
  });

  menu = new Menu("#menu", (value) => {
    switch (value.type) {
      case "opening":
        info.close();
        break;
      case "music":
      case "file":
        menu.close();
        break;
      case "open":
        fileInput.click();
        break;

      default:
        break;
    }
    console.log("menu", value);
  });
  menu.data = appData;

  fileInput = document.querySelector("#file-input");
  fileInput.onchange = () => {
    console.log("input changed");
  };
};
