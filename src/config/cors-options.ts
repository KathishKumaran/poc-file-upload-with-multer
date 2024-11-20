import logger from 'src/config/logger';

const corsOptions = (domain: string) => {
  return {
    origin: (origin: string, callback: any) => {
      if (domain !== origin && domain !== '*') {
        logger.error({ msg: `Origin ${origin} not allowed by CORS` });
        return callback(null, false);
      }
      return callback(null, true);
    },
    methods: 'OPTION, GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: ['Authorization', 'refresh_token'],
  };
};

export default corsOptions;
