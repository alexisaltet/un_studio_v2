var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var svgSymbols = require('gulp-svg-symbols');
var rename = require("gulp-rename");

// svg sprites
gulp.task('sprites', function () {
  return gulp.src('src/assets/svg/icons/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('src/assets/svg'));
});

// Generate scss in right dir for the svg sprite css
gulp.task('svg-scss', function () {
  gulp.src("src/assets/svg/svg-symbols.css")
  .pipe(rename("_icons.scss"))
  .pipe(gulp.dest("src/assets/scss/globals"));
});

// Compile sass
gulp.task('sass', function() {
  return gulp.src('src/assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Browser sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
})


// Autoprefixer
gulp.task('styles', function () {
  gulp.src('src/assets/scss/**/*.scss')
    .pipe(sass({style: 'expanded'}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/assets/css'));
});

// Minify css
gulp.task('minify-css', function() {
  return gulp.src('src/css/assets/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('src/assets/css/min'));
});

// Gulp dev task
gulp.task('dev', ['browserSync', 'sass', 'styles'], function (){
  gulp.watch('src/assets/scss/**/*.scss', ['sass']);
  gulp.watch('src/**/**/**/**/*.html', browserSync.reload);
  gulp.watch('src/assets/js/*.js', browserSync.reload);
  gulp.watch('src/assets/svg/**/*.svg', browserSync.reload);
  gulp.watch('src/assets/scss/**/*.scss', function(event) {
    gulp.run("styles")
  })
});
gulp.task('sprite', ['sprites', 'svg-scss'], function (){});
