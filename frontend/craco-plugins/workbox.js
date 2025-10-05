const { GenerateSW } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  overrideWebpackConfig: ({ webpackConfig, context: { env } }) => {
    if (env === 'production') {
      const workboxPlugin = new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        sourcemap: false,
        swDest: 'static/js/service-worker.js',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
            },
          },
          {
            urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
      });

      webpackConfig.plugins.push(workboxPlugin);
    }
    return webpackConfig;
  },
};