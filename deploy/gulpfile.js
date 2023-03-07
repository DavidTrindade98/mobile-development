import pkg from "gulp";
const { src, dest, series } = pkg;
import terser from "gulp-terser";
import concat from "gulp-concat";
import strReplace from "gulp-string-replace";
import each from "gulp-each";
import inlinesource from "gulp-source-injector";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import { deleteAsync } from "del";

//PROPS
let INDEX_DEV = "../index_dev.html";
let headName = "head.html";
let bodyName = "body.html";
let stylesName = "styles.css";
let scriptName = "script.js";

const terser_config = {
  compress: {
    dead_code: true,
    drop_console: true,
    drop_debugger: true,
    keep_classnames: false,
    keep_fargs: false,
    keep_fnames: false,
    keep_infinity: false,
  },
  mangle: {
    eval: false,
    keep_classnames: true,
    keep_fnames: false,
    toplevel: false,
    safari10: false,
  },
  module: true,
  sourceMap: false,
  output: {
    comments: false,
  },
};

const modules = [
  "../components/AudioPlayer.js",
  "../components/Component.js",
  "../components/Button.js",
  "../components/ToggleButton.js",
  "../components/ListButton.js",
  "../components/PeekABoo.js",
  "../components/Info.js",
  "../components/Controller.js",
  "../components/RangeBar.js",
  "../components/Splash.js",
  "../components/Menu.js",
  "../main.js",
];

//METHODS
const minifyHead = () => {
  return src(INDEX_DEV)
    .pipe(
      each((content, file, callback) => {
        let out = [];
        let collect = false;
        content.split("\n").forEach((ln) => {
          if (ln.includes("<head>")) collect = true;
          if (collect) out.push(ln);
          if (ln === "") collect = false;
        });
        content = out.join("\n");
        content = content.replace(/<head>/g, "");
        callback(null, content);
      })
    )
    .pipe(concat(headName))
    .pipe(dest(`./`));
};
const minifyBody = () => {
  return src(INDEX_DEV)
    .pipe(
      each((content, file, callback) => {
        let out = [];
        let collect = false;
        content.split("\n").forEach((ln) => {
          if (ln.includes("<body>")) collect = true;
          if (collect) out.push(ln);
          if (ln.includes("</body>")) collect = true;
        });
        content = out.join("\n");
        content = content.replace(/<body>/g, "");
        callback(null, content);
      })
    )
    .pipe(concat(bodyName))
    .pipe(dest(`./`));
};

const minifyCSS = () => {
  return src("../styles.css").pipe(cleanCSS()).pipe(concat(stylesName)).pipe(dest(`./`));
};
const minifyJS = () => {
  return src(modules)
    .pipe(
      each((content, file, callback) => {
        let out = [];
        content.split("\n").forEach((ln) => {
          if (ln.includes("import ")) ln = `//${ln}`;
          out.push(ln);
        });
        content = out.join("\n");
        callback(null, content);
      })
    )
    .pipe(strReplace("export default", ""))
    .pipe(concat(scriptName))
    .pipe(terser(terser_config))
    .pipe(dest(`./`));
};
const inject2HTML = () => {
  return src(`index_deploy.html`)
    .pipe(rename("index.html"))
    .pipe(inlinesource())
    .pipe(dest("../"));
};
const cleanup = () => {
  return deleteAsync([`${headName}`, `${bodyName}`, `${stylesName}`, `${scriptName}`], {
    force: true,
  });
};

export default series(minifyHead, minifyBody, minifyCSS, minifyJS, inject2HTML, cleanup);
