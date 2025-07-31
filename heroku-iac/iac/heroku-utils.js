/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const Heroku = require('heroku-client');
const { logger } = require('@mechometact/yonomi-node-utils');

logger.init({
  levels: {
    default: 'info',
  },
});

const log = logger.child('heroku-iac.heroku-utils');

const heroku = new Heroku({ token: process.env.HEROKU_API_KEY || '' });

async function deployApp(appConfig) {
  const { appName, teamId, stack } = appConfig;

  log.info('Creating app', { appName, teamId });

  try {
    const app = await heroku.post('/teams/apps', {
      body: {
        name: appName,
        region: 'us',
        team: teamId,
        stack,
      },
    });

    log.info('App created', { appId: app.id, appName: app.name });

    return app;
  } catch (error) {
    log.error('Error creating app', { error });
    throw error;
  }
}

async function deployPipeline(pipelineConfig) {
  const { appPrefix, teamId } = pipelineConfig;

  log.info('Creating pipeline', { appPrefix, teamId });

  try {
    const pipeline = await heroku.post('/pipelines', {
      body: {
        name: appPrefix,
        owner: {
          id: teamId,
          type: 'team',
        },
      },
      ephemeral_apps: {
        collaborators_enabled: true,
        collaborator_synchronization: true,
        collaborator_permissions: [],
      },
    });

    log.info('Pipeline created', { pipelineId: pipeline.id });

    return pipeline;
  } catch (error) {
    log.error('Error creating pipeline', { error });
    throw error;
  }
}

async function addAppToPipeline(pipelineCouplingConfig) {
  const { appId, pipelineId, stage } = pipelineCouplingConfig;

  log.info('Adding app to pipeline', { appId, pipelineId });

  try {
    await heroku.post('/pipeline-couplings', {
      body: {
        app: appId,
        pipeline: pipelineId,
        stage,
      },
    });

    log.info('App added to pipeline successfully', { appId, pipelineId, stage });
  } catch (error) {
    log.error('Error adding app to pipeline', { error });
    throw error;
  }
}

async function createAddOns(addOnConfig) {
  const { appId, addOnName } = addOnConfig;

  log.info('Creating add-on', { appId, addOnName });

  try {
    const addOn = await heroku.post(`/apps/${appId}/addons`, {
      body: {
        plan: addOnName,
      },
    });

    log.info('Add-on created', { addOnId: addOn.id, addOnName: addOn.name });

    return addOn;
  } catch (error) {
    log.error('Error creating add-on', { error });
    throw error;
  }
}

async function createScheduledJob(scheduledJobConfig) {
  const { appId, attributes } = scheduledJobConfig;
  const {
    at,
    command,
    dyno_size,
    every,
  } = attributes;

  log.info('Creating scheduled job', {
    appId, command, at, dyno_size, every,
  });

  try {
    const job = await heroku.request({
      host: 'https://particleboard.heroku.com',
      path: `/apps/${appId}/jobs`,
      method: 'POST',
      body: {
        data: {
          attributes: {
            at,
            command,
            'dyno-size': dyno_size,
            every,
          },
          type: 'job',
        },
      },
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${process.env.HEROKU_API_KEY || ''}`,
      },
    });

    log.info('Scheduled job created', {
      appId, command, at, dyno_size, every,
    });

    return job;
  } catch (error) {
    log.error('Error creating scheduled job', { error });
    throw error;
  }
}

async function setConfigVars(appConfig) {
  const { appId, config_vars } = appConfig;

  log.info('Adding config vars', { appId, config_vars });

  try {
    await heroku.patch(`/apps/${appId}/config-vars`, {
      body: config_vars,
    });

    log.info('Config vars added successfully', { appId });
  } catch (error) {
    log.error('Error adding config vars', { error });
    throw error;
  }
}

async function scaleDyno(dynoConfig) {
  const {
    appName, formation,
  } = dynoConfig;

  log.info('Scaling dyno', {
    appName, formation,
  });

  try {
    await heroku.patch(`/apps/${appName}/formation`, {
      body: {
        updates: formation,
      },
    });

    log.info('Dyno scaled successfully', {
      appName, formation,
    });
  } catch (error) {
    log.error('Error scaling dyno', { error });
    throw error;
  }
}

async function enableFeatures(featuresConfig) {
  const { appName, features } = featuresConfig;

  log.info('Enabling features', { appName, features });

  if (!features || features.length === 0) {
    log.warn('No features to enable for app', { appName });
    return;
  }

  try {
    for (const feature of features) {
      await heroku.patch(`/apps/${appName}/features/${feature}`, {
        body: {
          enabled: true,
        },
      });
    }

    log.info('Features enabled successfully', { appName, features });
  } catch (error) {
    log.error('Error enabling features', { error });
    throw error;
  }
}

async function createDomain(domainConfig) {
  const { appName, domain } = domainConfig;

  log.info('Creating domain', { appName, domain });

  try {
    await heroku.post(`/apps/${appName}/domains`, {
      body: {
        hostname: domain,
        sni_endpoint: null,
      },
    });

    log.info('Domain created successfully', { appName, domain });
  } catch (error) {
    log.error('Error creating domain', { error });
    throw error;
  }
}

module.exports = {
  deployApp,
  deployPipeline,
  addAppToPipeline,
  scaleDyno,
  createScheduledJob,
  createAddOns,
  setConfigVars,
  enableFeatures,
  createDomain,
};
