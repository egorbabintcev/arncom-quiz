const paths = {
  src: {
    styles: './src/sass/main.scss',
    img: './public/img/*'
  },
  dest: {
    styles: './public/css/',
    img: './public/img'
  },
  watch: {
    styles: './src/sass/**/*.s(a|c)ss',
    public: './public/**/*'
  }
}

const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const isProd = process.env.NODE_ENV === 'production';

gulp.task('styles', () => {
  return gulp.src(paths.src.styles)
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass({ includePaths: [ 'node_modules' ] }))
    .pipe(gulpIf(isProd, cssnano({ discardUnused: false }), autoprefixer()))
    .pipe(gulpIf(!isProd, sourcemaps.write()))
    .pipe(gulp.dest(paths.dest.styles))
})

gulp.task('images', () => {
  return gulp.src(paths.src.img)
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          { optimizationLevel: 3 },
          { progessive: true },
          { interlaced: true },
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false },
          { cleanupIDs: false }
       ]
     }),
     imagemin.gifsicle(),
     imagemin.mozjpeg({ progessive: true }),
     imagemin.optipng()
    ]))
    .pipe(gulp.dest(paths.dest.img))
})

gulp.task('server', () => {
  browserSync.init({
    proxy: 'http://arnkom.local'
  })
})

gulp.task('watch', () => {
  gulp.watch(paths.watch.styles, gulp.parallel('styles'));
  gulp.watch(paths.watch.public).on('change', browserSync.reload);
})

gulp.task('dev', gulp.series('styles', gulp.parallel('server', 'watch')));

gulp.task('build', gulp.parallel('styles', 'images'));

gulp.task('default', gulp.parallel(isProd ? 'build' : 'dev'));
