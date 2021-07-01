let mix = require('laravel-mix');

/**
 * Settings and Options
 */
const sass_options = {
  sassOptions: {
    outputStyle: 'expanded'
  },
}

let webpackConfigOptions = {};

mix.setPublicPath('public/css');

mix.options({
  processCssUrls: false,
  autoprefixer: {
    // browsers are listed in package.json
    cascade: false,
  },
});

if (!mix.inProduction()) {
  // Do non-inline source-maps
  webpackConfigOptions.devtool = "source-map";
}

mix.webpackConfig(webpackConfigOptions);

/**
 * Vendor-related tasks (copy vendor scripts into public folder, and etc.)
 * that we don't usually need to do by default.
 * 
 * `npm run copy`
 */
if (process.env.COPY_VENDOR === 'yes') {

  mix.copy('node_modules/orgchart/dist/js/jquery.orgchart.js', 'public/js/jquery.orgchart.js')
    .copy('node_modules/html2canvas/dist/html2canvas.min.js', 'public/js/html2canvas.min.js');

}
/**
 * App-related tasks (compile css, scripts, and etc.)
 *
 * `npm run dev` or `npm run watch` or `npm run prod`
 */
else {

  mix.sass('public/css/source/orgchart/orgchart.scss', 'public/css', sass_options)
    .sass('public/css/source/personlist/personlist.scss', 'public/css', sass_options);

  if (!mix.inProduction()) {
    mix.sourceMaps();
  }

  mix.version();

}
