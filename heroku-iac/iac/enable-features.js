/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const { logger } = require('@mechometact/yonomi-node-utils');
const { appConfig } = require('./config');
const {
  enableFeatures,
} = require('./heroku-utils');
const { getEnv } = require('./utils');

logger.init({
  levels: {
    default: 'info',
  },
});

const log = logger.child('heroku-iac.enable-features');

async function main() {
  log.info('Starting Heroku feature enabling');

  const appName = getEnv('HEROKU_APP_NAME');

  if (!appConfig.features) {
    log.warn(`No features to enable for app ${appName}, skipping enabling`);
  } else {
    await enableFeatures({
      appName,
      features: appConfig.features,
    });
  }

  log.info('Heroku feature enabling completed');
}

main();
