const path = require('path');
const workboxPlugin = require('./craco-plugins/workbox');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    configure: (webpackConfig, { env, paths }) => {
      // Filter out HotModuleReplacementPlugin in production
      if (env === 'production') {
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });
        
        // Disable watch mode in production
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories in development
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }
      
      return webpackConfig;
    }
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  plugins: [
    { plugin: workboxPlugin }
  ]
};