import {
  CorsConfig,
  GraphqlConfig,
  SwaggerConfig,
} from '../configs/config.interface';

export const isProduction = process.env.NODE_ENV === 'production';

export const isStaging = process.env.NODE_ENV === 'staging';

export const isDevelop = !isProduction && !isStaging;

export const getCors = (): CorsConfig => {
  const origin = [];

  switch (true) {
    case isProduction:
      origin.push('https://app.vtvl.io', 'https://portfolio.vtvl.io');
      break;
    case isStaging:
      origin.push(
        'https://staging-v2.vtvl.io',
        'https://staging-portfolio.vtvl.io'
      );
      break;
    default:
      origin.push(
        'https://qa-v2.vtvl.io',
        'https://qa-portfolio.vtvl.io',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        // vercel preview link
        /^https:\/\/vtvl-v2-app-[a-z0-9-]+\.vtvl\.vercel\.app\//,
        /^https:\/\/vtvl-institutional-[a-z0-9-]+\.vtvl\.vercel\.app\//
      );
  }

  return {
    enabled: true,
    origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Length',
      'Content-Type',
      'Accept',
      'Accept-Encoding',
      'Accept-Language',
      'Authorization',
      'User-Agent',
      'Host',
      'Origin',
      'Referer',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };
};

export const getSwagger = (): SwaggerConfig => {
  return {
    enabled: !isProduction,
    title: 'VTVL API',
    description: 'The VTVL API description',
    version: '1.0',
    path: 'api',
  };
};

export const getGraphql = (): GraphqlConfig => {
  return {
    playgroundEnabled: !isProduction,
    debug: !isProduction,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  };
};
