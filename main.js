import AudioPlayer from "./components/AudioPlayer.js";
import Controller from "./components/Controller.js";
import Info from "./components/Info.js";
import Menu from "./components/Menu.js";
import PeekABoo from "./components/PeekABoo.js";
import RangeBar from "./components/RangeBar.js";
import Splash from "./components/Splash.js";

let appData;
let audioPlayer;

let splash;
let peekaboo;
let info;
let controller;
let scrub;
let volumeBar;
let menu;

const API_URL = "https://shrouded-fire-liver.glitch.me/";

window.onload = async () => {
  setupPWA();

  await initialize(API_URL, true);
  setupLayout();
  setupAudio();
};

const setupPWA = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
};

const initialize = async (api_url, withSplash = false) => {
  if (withSplash) splash = new Splash();
  try {
    const req = await fetch(api_url, {
      headers: {
        "Accept-Encoding": "gzip",
      },
    });
    const apiData = await req.json();
    appData = [
      ...apiData,
      {
        type: "open",
        name: "open...",
      },
      {
        type: "reset",
        name: "reset",
      },
      {
        type: "exit",
        name: "exit",
      },
    ];
    if (withSplash) splash.delete();
  } catch (error) {
    if (withSplash) splash.error();
    else {
      peekaboo.show("Something went wrong...", "error");
    }
  }
};

const setupLayout = () => {
  peekaboo = new PeekABoo("#peek-a-boo");

  info = new Info("#info", (value) => {});

  controller = new Controller("#controller", (action) => {
    switch (action) {
      case "play":
        audioPlayer.currentTrack ? audioPlayer.play() : menu.open();
        break;
      case "pause":
        audioPlayer.pause();
        break;
      case "next":
        audioPlayer.next();
        break;
      case "previous":
        audioPlayer.previous();
        break;
    }
  });

  scrub = new RangeBar("#scrub", (value) => {
    audioPlayer.scrub(value);
  });

  volumeBar = new RangeBar("#volume", (value) => {
    audioPlayer.volume = value;
  });

  menu = new Menu("#menu", async (value) => {
    switch (value.type) {
      case "opening":
        info.close();
        break;
      case "music":
      case "file":
        menu.close();
        await audioPlayer.play(value, fetchPlaylist(appData, value.id));
        break;
      case "open":
        document.querySelector("#file-input").click();
        break;
      case "reset":
        menu.close();
        await initialize(`${API_URL}/reset`);
        menu.data = appData;
        peekaboo.show("Data updated!");
        break;
      case "exit":
        window.close();
        break;
    }
  });
  menu.data = appData;

  const fileInput = document.querySelector("#file-input");
  fileInput.onchange = async () => {
    const localPlaylist = [];
    Array.from(fileInput.files).forEach((file) => {
      localPlaylist.push({
        id: file.name,
        name: file.name,
        type: "file",
        url: URL.createObjectURL(file),
      });
    });
    menu.close();
    await audioPlayer.play(localPlaylist[0], localPlaylist);
  };
};

const setupAudio = () => {
  audioPlayer = new AudioPlayer((action, error = null) => {
    if (action !== "progress") controller.setState(action);

    switch (action) {
      case "error":
        info.update({
          name: audioPlayer.currentTrack.name,
          type: "error",
          error: error,
        });
        break;
      case "play":
        if (audioPlayer.duration === Infinity) {
          scrub.element.style.display = "none";
        } else {
          scrub.element.style.display = "flex";
        }
        info.update(audioPlayer.currentTrack);
        break;
      case "progress":
        scrub.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        break;

      default:
        break;
    }
  });
  audioPlayer.volume = volumeBar.value;
};

const fetchPlaylist = (node, itemID) => {
  let item = null;
  for (let i = 0; i < node.length; i++) {
    const n = node[i];
    if (n.children) item = fetchPlaylist(n.children, itemID);
    else if (n.id === itemID) item = node;

    if (item) break;
  }
  return item;
};
