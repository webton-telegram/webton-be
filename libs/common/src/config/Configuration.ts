export enum SupportedEnvironment {
  test = 'test',
  local = 'local',
  development = 'development',
  production = 'prod',
}

export interface Configuration {
  readonly ENV: SupportedEnvironment;

  readonly PORT: number;
  readonly API_VERSION: string;
  readonly HTTP_BODY_SIZE_LIMIT: string;
  readonly HTTP_URL_LIMIT: string;

  readonly JWT_SECRET: string;
  readonly JWT_ACCESS_EXPIRES_IN: string;
  readonly JWT_REFRESH_EXPIRES_IN: string;

  readonly TELEGRAM_BOT_TOKEN: string;

  readonly TON_ADMIN_WALLET_MNEMONIC: string;
  readonly TOKEN_CONTRACT_ADDRESS: string;
  readonly TON_ADMIN_ADDRESS: string;
  readonly TON_ADMIN_JETTON_ADDRESS: string;

  readonly DB_INFO: {
    host: string;
    port: number;
    max: number;
    database: string;
    user: string;
    password: string;
    sync: boolean;
  };

  readonly AWS_S3: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
  };
}
