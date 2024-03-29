const {
  series,
  src,
  dest,
  watch,
  parallel
} = require("gulp");
const rename = require("gulp-rename"),
  gulpif = require("gulp-if"),
  del = require("del"),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  nunjucksRender = require("gulp-nunjucks-render"),
  browserSync = require("browser-sync"),
  browserify = require("browserify"),
  babelify = require("babelify"),
  source = require("vinyl-source-stream"),
  buffer = require("vinyl-buffer"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify");
browserSync.create();

// * Copys the images in the /src/assets and places them in the /dist/assets
function copy() {
  return src('./src/assets/*.+(png|jpg|gif|jpeg|webp|svg)')
    .pipe(dest('./dist/assets/'))
}

// * Cleans dist folder
function clean() {
  return del(['dist/**'])
}

/* 
  * Standard Nunjucks script:
    - Looks for files in the './src/pages/' folder
    - Runs it thorough the nunjucks rendering
    - and outputs the results here './dist/'
    - streams changes to browser-sync instance invoked by the `gulp` script
*/
function nunjucks() {
  return src('./src/pages/*.+(html|nunjucks|njk)')
    .pipe(
      nunjucksRender({
        path: ["./src/html"]
      }))
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
}

// * Converts sass to css
function sassFn() {
  return src('./src/scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(dest('./dist/'))
    .pipe(browserSync.stream());
}

// * Processes JavaScript
// JavaScript source file order (for concatenation)
const jsSourceFile = 'index.js';
const jsSourceFolder = './src/js/'

// dev mode, switch to 'false' for production (uglification)
const dev = true;

function processJS() {
  return browserify({
      entries: [jsSourceFolder + jsSourceFile],
      debug: true
    })
    .transform(babelify, {
      presets: ["@babel/preset-env"],
      sourceMaps: false
    })
    .bundle()
    .pipe(source(jsSourceFile))
    .pipe(rename({
      basename: 'bundle'
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    // if production environment, then uglify code else
    .pipe(gulpif(!dev, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist/'))
}

// * Creates a browsersync instance
function browser_sync(done) {
  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "index.html"
    }
  });
  done();
}

// * Watches for file changes in `src` folder
function watchFiles() {
  watch(
    [
      './src/scss/**/*.scss',
      './src/js/*.js',
      './src/**/*.+(html|nunjucks|njk)'
    ], series(clean, sassFn, processJS, nunjucks, copy))
  watch('./src/assets/*.+(png|jpg|gif|jpeg)', copy)
}

// * Default gulp variable
// * represents the `gulp` command
const watchFn = series(clean, sassFn, processJS, nunjucks, copy, parallel(watchFiles, browser_sync));

exports.default = watchFn;

exports.copy = copy;
exports.clean = clean;