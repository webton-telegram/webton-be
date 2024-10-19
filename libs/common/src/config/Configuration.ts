export enum SupportedEnvironment {
  test = 'test',
  local = 'local',
  development = 'development',
  production = 'prod',
}

export interface Configuration {
  // STAGE Environment
  readonly ENV: SupportedEnvironment;

  // API SERVICE VARIABLE
  readonly PORT: number;
  readonly API_VERSION: string;
  readonly HTTP_BODY_SIZE_LIMIT: string;
  readonly HTTP_URL_LIMIT: string;

  readonly DB_INFO: {
    host: string;
    port: number;
    max: number;
    database: string;
    user: string;
    password: string;
    sync: boolean;
  };
}
