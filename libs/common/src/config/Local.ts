import { Configuration, SupportedEnvironment } from './Configuration';

const config: Configuration = {
  // STAGE Environment
  ENV: SupportedEnvironment.local,

  // SERVICE PORT
  PORT: 8000,
  API_VERSION: 'v1',
  HTTP_BODY_SIZE_LIMIT: '1mb',
  HTTP_URL_LIMIT: '1mb',

  DB_INFO: {
    host: 'aws-0-ap-northeast-2.pooler.supabase.com',
    port: 6543,
    max: 50,
    database: 'postgres',
    user: 'postgres.ycmzlccicnhuokvitjio',
    password: '',
    sync: true,
  },
};

export default config;
