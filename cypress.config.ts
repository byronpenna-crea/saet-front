import { defineConfig } from 'cypress';

export default defineConfig({

  e2e: {
    baseUrl: 'http://192.168.1.12/#/menu',
    video: true,
    env: {
      NEXT_PUBLIC_BASE_PATH: ''
    },
    videosFolder: 'cypress/report/videos',
    screenshotsFolder: 'cypress/report/screenshots',
    experimentalModifyObstructiveThirdPartyCode: true,
    specPattern: 'cypress/e2e/**/*.feature' ,
    async setupNodeEvents(on, config) {
      const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin
      const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')

      // await here
      await require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin(on, config)

      on('file:preprocessor',   createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));

      // return any mods to Cypress
      return config
    }
  }
});
