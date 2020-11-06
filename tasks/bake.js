const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const config = require("../project.config.json");

const gulpData = require("gulp-data");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const isValidGlob = require("is-valid-glob");

//modularize manageEnv
const journalize = require("journalize");
const fs = require("fs");

module.exports = (resolve) => {
  const dataDir = "src/data/";

  //modularize manageEnv from nunjucks.js
  const manageEnv = function (env) {
    // loop over config vars to add to nunjucks global env
    // which can be added to project.config.json
    for (var k in config) {
      if (config.hasOwnProperty(k)) {
        env.addGlobal(k, config[k]);
      }
    }

    let data_dir = "src/data/";

    // loop over the directory of files
    fs.readdir(data_dir, function (err, files) {
      // handle errors
      if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
      }

      // for each file
      files.forEach(function (file, index) {
        // if it's a .json file
        if (file.endsWith("json")) {
          // make the key the file name
          let key = file.split(".json")[0];

          // and the value the file contents
          let value = require("../" + data_dir + key);

          // and add to our global environment
          env.addGlobal(key, value);
        }
      });
    });

    // set up journalize
    for (let key in journalize) {
      let func = journalize[key];
      if (typeof func === "function") {
        env.addFilter(key, func);
      }
    }
  };

  if (!config.to_bake) {
    resolve();
    return;
  }

  config.to_bake.forEach((bake) => {
    if (!bake.template) {
      throw new Error(`bake.template is undefined. Add a nunjucks template.`);
    }
    if (!bake.slug) {
      throw new Error(
        `bake.slug is undefined. Specify a key that will be used as the slug for the page.`
      );
    }
    if (bake.path == null) {
      throw new Error(
        `bake.path is undefined. Specify a path where your pages will be baked.`
      );
    }

    let data = require(`../${dataDir}${bake.data}.json`);
    if (typeof data === "object") {
      data = data[bake.array];
    }
    if (!data) {
      throw new Error(
        `data[${bake.array}] is undefined. Specify the valid array.`
      );
    }

    data.forEach((d) => {
      if (!d[bake.slug]) {
        throw new Error(
          `d[${bake.slug}] is undefined. Specify a key that will be used as the slug for the page.`
        );
      }

      if (!isValidGlob(`docs/${bake.path}/${d[bake.slug]}.html`)) {
        throw new Error(
          `docs/${bake.path}/${d[bake.slug]}.html is not a valid glob.`
        );
      }

      gulp
        .src(`src/njk/_templates/${bake.template}.njk`)
        .pipe(gulpData(d))
        .pipe(
          nunjucksRender({
            path: "src/njk",
            manageEnv: manageEnv,
          })
        )
        .pipe(
          rename({
            basename: d[bake.slug],
            extname: ".html",
          })
        )
        .pipe(gulp.dest(`docs/${bake.path}`))
        .pipe(browserSync.stream());
    });
  });

  resolve();
};
