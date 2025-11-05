const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'demoblaze-automation',

  e2e: {
    baseUrl: 'https://www.demoblaze.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    downloadsFolder: 'cypress/downloads',

    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    // Viewport (Desktop)
    viewportWidth: 1366,
    viewportHeight: 768,

    // Retries
    retries: {
      runMode: 1, // When running via `cypress run`
      openMode: 0, // When using `cypress open`
    },

    // Screenshot on Failure
    video: false,
    videoCompression: 32,
    screenshotOnRunFailure: true,

    // Setup Node Events
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
