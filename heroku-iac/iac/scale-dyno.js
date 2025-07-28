/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const { logger } = require('@mechometact/yonomi-node-utils');
const { appConfig } = require('./config');
const {
  scaleDyno,
} = require('./heroku-utils');
const { getEnv } = require('./utils');

logger.init({
  levels: {
    default: 'info',
  },
});

const log = logger.child('heroku-iac.scale-dyno');

async function main() {
  log.info('Starting Heroku dyno scaling');

  const appName = getEnv('APP_NAME');

  if (!appConfig.formation) {
    log.warn(`Dyno configuration not specified for app ${appName}, skipping scaling`);
  } else {
    await scaleDyno({
      appName,
      formation: appConfig.formation,
    });
  }

  log.info('Heroku dyno scaling completed');
}

main();
