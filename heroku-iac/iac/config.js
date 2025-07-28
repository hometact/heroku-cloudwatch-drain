const { getEnv } = require('./utils');

module.exports.appConfig =
{
  config_vars: {
    "AWS_ACCESS_KEY_ID": getEnv('AWS_ACCESS_KEY_ID'),
    "AWS_REGION": getEnv('AWS_REGION'),
    "AWS_SECRET_ACCESS_KEY": getEnv('AWS_SECRET_ACCESS_KEY'),
    "GO_SETUP_GOPATH_IN_IMAGE": "true",
    "PASS": getEnv('PASS'),
    "RETENTION": "731",
    "STRIP_ANSI_CODES": "true",
    "USER": getEnv('USER'),
  },
  formation: [
    {
      type: 'web',
      quantity: 1,
      dyno_size: {
        id: '5c93cdee-2bbd-4fc0-9f04-d369d1dbb962', // Basic
      },
    },
  ],
}
  ;
