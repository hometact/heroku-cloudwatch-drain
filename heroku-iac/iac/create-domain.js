/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const { logger } = require('@mechometact/yonomi-node-utils');
const { appsConfig } = require('./config');
const {
  createDomain,
} = require('./heroku-utils');
const { getEnv } = require('./utils');

logger.init({
  levels: {
    default: 'info',
  },
});

const log = logger.child('heroku-iac.create-domain');

async function main() {
  log.info('Starting Heroku domain creation');

  const appName = getEnv('HEROKU_APP_NAME');

  if (!appConfig.domain) {
    log.warn(`No domain to create for app ${appName}, skipping creation`);
  } else {
    await createDomain({
      appName,
      domain: appConfig.domain,
    });
  }

  log.info('Heroku domain creation completed');
}

main();
