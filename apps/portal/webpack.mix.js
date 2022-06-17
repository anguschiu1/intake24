const mix = require('laravel-mix');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand.expand(env);

const publicPath = process.env.PUBLIC_DIR || 'public';

mix
  .disableNotifications()
  .setPublicPath(publicPath)
  .scripts(
    [
      'node_modules/@popperjs/core/dist/umd/popper.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
    ],
    `${publicPath}/site.js`
  )
  .sass('assets/scss/site.scss', `${publicPath}/site.css`)
  .options({
    processCssUrls: false,
  })
  .copy('assets/img', `${publicPath}/img`)
  .copy('assets/output-samples', `${publicPath}/output-samples`);

if (mix.inProduction) mix.version();
