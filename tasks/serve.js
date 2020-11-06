const gulp = require("gulp");
const browserSync = require("browser-sync");

// BrowserSync Reload
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

module.exports = () => {
  browserSync({
    notify: false,
    server: "docs",
    port: 3000,
  }),
    gulp.watch(
      ["src/njk/**/*.html", "src/njk/**/*.njk", "src/njk/**/*.json"],
      gulp.series("nunjucks", "bake", browserSyncReload)
    );
  gulp.watch(
    ["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/**/*.scss"],
    gulp.series("styles", browserSyncReload)
  );
  gulp.watch(
    ["src/js/**/*.js"],
    gulp.series("lint", "scripts", browserSyncReload)
  );
  gulp.watch(["src/assets/img/**/*"], gulp.series("images", browserSyncReload));
};
