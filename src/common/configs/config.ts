import { getCors, getSwagger, getGraphql } from '../utils/api';
import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: getCors(),
  swagger: getSwagger(),
  // graphql: getGraphql(),
  security: {
    expiresIn: '1d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
