const gulp = require("gulp");

// load gulp tasks from ./tasks
require("gulp-load-tasks")();

// default tasks
gulp.task(
  "default",
  gulp.series(
    "clean",
    "styles",
    "copy",
    gulp.parallel("lint", "scripts", "images"),
    "nunjucks",
    "bake"
  )
);

gulp.task("dev", gulp.series("default", "serve"));
