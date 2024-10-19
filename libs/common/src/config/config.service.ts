import { Injectable } from '@nestjs/common';
import { Configuration, SupportedEnvironment } from './Configuration';
import Local from './Local';
import Development from './Development';
import Production from './Production';

@Injectable()
export class ConfigService {
  private static config: Configuration;

  static getConfig(): Configuration {
    if (!this.config) {
      switch (process.env.NODE_ENV) {
        case SupportedEnvironment.local:
          this.config = Local;
          break;
        case SupportedEnvironment.development:
          this.config = Development;
          break;
        case SupportedEnvironment.production:
          this.config = Production;
          break;
        case SupportedEnvironment.test:
          this.config = Development;
          break;
        default:
          throw new Error('정의되지 않은 환경입니다');
      }
    }

    return this.config;
  }

  static isProduction(): boolean {
    return ConfigService.getConfig().ENV === 'prod';
  }
}
