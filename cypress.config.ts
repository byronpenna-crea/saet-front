import { defineConfig } from 'cypress';
import * as fs from 'fs';

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: 'http://192.168.1.12',
    video: true,
    videosFolder: 'cypress/videos',
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        CYPRESS_SSL_VERIFY: false,
      };

      return config;
    },

    supportFile: 'cypress/support/index.ts',
  },
});
