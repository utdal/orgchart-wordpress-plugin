/** Gulp file for tasks */

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  public: {
    orgchart: {
      source: 'public/css/source/orgchart',
    },
    personlist: {
      source: 'public/css/source/personlist',
    },
    css:   'public/css',
    fonts: 'public/fonts',
    js:    'public/js',
  },
  admin: {
    sass:  'admin/css/source',
    css:   'admin/css',
    js:    'admin/js',
  },
  jquery_orgchart: {
    source: 'node_modules/orgchart/dist',
  },
  html2canvas: {
    source: 'node_modules/html2canvas/dist',
  }
};

var options = {
  // Sass options
  sass: {
    style: 'nested',
    sourcemap: true,
    cacheLocation: '/tmp/sass-cache',
  },
  // AutoPrefixer options
  autoprefixer: {
    browsers: ['> 1%'],
    cascade: false,
  },
};

/**
 * Compile Sass.
 * 
 * @param  {string} sass_path : where the Sass files are
 * @param  {string} css_path  : where to put the CSS file
 */
const compile_sass = (sass_path, css_path) => sass(sass_path, options.sass)
  .pipe(autoprefixer(options.autoprefixer))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(css_path));

// Orgchart Sass
gulp.task('orgchart-sass', () => compile_sass(paths.public.orgchart.source + '/orgchart.scss', paths.public.css));

// Personlist Sass
gulp.task('personlist-sass', () => compile_sass(paths.public.personlist.source + '/personlist.scss', paths.public.css));

/**
 * Copy files.
 * 
 * @param  {string} source_path : source files
 * @param  {string} dest_path   : destination
 */
const copy_files = (source_path, dest_path) => gulp.src(source_path)
  .pipe(gulp.dest(dest_path));

// Copy Org Chart files
gulp.task('copy-org-chart', () => {
  copy_files(paths.html2canvas.source + '/html2canvas.min.js', paths.public.js);
  return copy_files(paths.jquery_orgchart.source + '/js/jquery.orgchart.js', paths.public.js);
});

// Copy
gulp.task('copy', [
  'copy-org-chart',
]);

// Sass
gulp.task('sass', [
  'orgchart-sass',
  'personlist-sass',
]);

// Watch
gulp.task('watch', () => {
  gulp.watch(paths.public.orgchart.source + '/**/*.scss', ['orgchart-sass']);
  gulp.watch(paths.public.personlist.source + '/**/*.scss', ['personlist-sass']);
});

// Default
gulp.task('default', [
  'copy',
  'sass'
]);