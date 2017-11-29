const mix = require('laravel-mix');

mix.react('resources/assets/js/app.js', 'public/js')
   .setPublicPath('public')
   .setResourceRoot('/')
   .sass('resources/assets/sass/app.scss', 'public/css')
   .copy('node_modules/font-awesome/fonts', 'public/fonts');
