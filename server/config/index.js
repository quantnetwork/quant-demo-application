import path from 'path';
import log4js from 'log4js';
import secureEnv from 'secure-env';
import defaultConfig from './default';

const log = log4js.getLogger('config');

async function getConfig() {
  log.info('Loading configuration...');

  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  const environment = process.env.NODE_ENV || 'local';
  log.info('Environment: ', environment);

  log.info(path.resolve(__dirname, environment));
  const configFile = require(path.resolve(__dirname, environment)).default;
  log.info('configFile:', configFile);

  const config = { ...defaultConfig, ...configFile };

  global.env = secureEnv({ secret: config.envFilePassword });

  config.privateKeys = {
    ethereum: process.env.PARTY_A_ETHEREUM_PRIVATE_KEY,
    bitcoin: process.env.PARTY_A_BITCOIN_PRIVATE_KEY,
    xrp: process.env.PARTY_A_XRP_LEDGER_PRIVATE_KEY,
  };

  log.info('Config:', JSON.stringify(config, null, 2));
  log.info('Configuration loaded');
  return config;
}

export default getConfig;
