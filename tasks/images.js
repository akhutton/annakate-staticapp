const gulp = require('gulp');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg'); 
const imageminPngquant = require('imagemin-pngquant');

module.exports = () => {
  return gulp.src('./src/img/**/*')
    .pipe(cache(imagemin([
      // lossy jpg compression
      imageminMozjpeg({
        quality: 50
      }),
      // png compression
      imageminPngquant({
        speed: 1,
        quality: 98 //lossy settings
      })
  ])))
    .pipe(gulp.dest('./docs/img'))
};
