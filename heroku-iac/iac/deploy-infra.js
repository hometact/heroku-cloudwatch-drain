/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const { logger } = require('@mechometact/yonomi-node-utils');
const { appConfig } = require('./config');
const {
  deployApp,
  createAddOns,
  createScheduledJob,
  setConfigVars,
} = require('./heroku-utils');
const { getEnv } = require('./utils');

logger.init({
  levels: {
    default: 'info',
  },
});

const log = logger.child('heroku-iac.deploy-infra');

async function main() {
  log.info('Starting Heroku deployment');

  const appName = getEnv('HEROKU_APP_NAME');
  const teamId = getEnv('HEROKU_TEAM_ID');

  const app = await deployApp({
    appName,
    teamId,
    stack: appConfig.stack,
  });

  await setConfigVars({
    appId: app.id,
    config_vars: appConfig.config_vars || {},
  });

  if (appConfig.addons) {
    for (const addon of appConfig.addons) {
      await createAddOns({
        appId: app.id,
        addOnName: addon.name,
      });

      if (addon.name === 'scheduler:standard' && addon.schedules && addon.schedules.length > 0) {
        for (const schedule of addon.schedules) {
          const {
            command, at, dyno_size, every,
          } = schedule.attributes;

          await createScheduledJob({
            appId: app.id,
            attributes: {
              command,
              at,
              dyno_size,
              every,
            },
          });
        }
      }
    }
  }

  log.info('Heroku deployment completed');
}

main();
