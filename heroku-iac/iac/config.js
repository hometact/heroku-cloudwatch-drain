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
        id: '03307558-da97-4417-b1b3-e7f23b565422', // Standard-1X
      },
    },
  ],
  features: ['preboot']
}
