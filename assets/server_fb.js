import fs from "fs";
import util from "util";
import path from "path";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";

import express from "express";
import cors from "cors";
import compression from "compression";

const __dirname = path.resolve();
const writeFileAsync = util.promisify(fs.writeFile);

const firebaseConfig = {
  apiKey: "AIzaSyAdWJ9z2NyUiIBOq33gDwwVvVe9wrW71NA",
  authDomain: "web-development-etic.firebaseapp.com",
  projectId: "web-development-etic",
  storageBucket: "web-development-etic.appspot.com",
  messagingSenderId: "564746533143",
  appId: "1:564746533143:web:56f8e2826478009d975f52",
  measurementId: "G-K38DNHDBP5",
};
// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const database = getFirestore(firebase_app);
const storage = getStorage();

let APP_DATA = null;

const app = express();

app.use(compression());
app.use(cors());

app.get("/", async (req, res) => {
  if (!APP_DATA) {
    APP_DATA = await reset();
  }
  res.json(APP_DATA);
});
app.get("/reset", async (req, res) => {
  APP_DATA = await reset();
  res.json(APP_DATA);
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

const reset = async () => {
  const radios = await getRadios();
  const music = await getMusic(ref(storage, ""));
  const dataOut = [
    {
      id: "radios",
      type: "folder",
      name: "radios",
      children: radios,
    },
    {
      id: "music",
      type: "folder",
      name: "music",
      children: music.children,
    },
  ];

  try {
    const publicDirPath = path.join(__dirname, "public");
    const filePath = path.join(publicDirPath, "/app_data.json");
    await writeFileAsync(filePath, JSON.stringify(dataOut));
    return dataOut;
  } catch (error) {
    return [{ error: error }];
  }
};
//API Firebase
const getRadios = async () => {
  const querySnapshot = await getDocs(collection(database, "music"));
  const radios = [];
  querySnapshot.forEach((doc) => {
    radios.push({ ...doc.data(), id: `radios/${doc.data().name}`, type: "music" });
  });
  return radios;
};
const getMusic = async (ref) => {
  let resultObj = {
    children: [],
  };
  const result = await listAll(ref);
  const itemsPromises = result.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const itemID = itemRef.fullPath.split("/");
    itemID.pop();
    resultObj.children.push({
      id: `music/${itemRef.fullPath}`,
      type: "file",
      name: itemRef.name.replace(".mp3", ""),
      url: url,
    });
  });
  const prefixesPromises = result.prefixes.map(async (subfolderRef) => {
    const subfolderObj = await getMusic(subfolderRef);
    const deconstruct = subfolderRef.fullPath.split("/");
    resultObj.children.push({
      id: `music/${subfolderRef.fullPath}`,
      type: "folder",
      name: deconstruct[deconstruct.length - 1],
      children: subfolderObj.children.length > 0 ? subfolderObj.children : subfolderObj,
    });
  });

  await Promise.all([...itemsPromises, ...prefixesPromises]);
  return resultObj;
};
