import { ConfigService } from '@app/common/config/config.service';
import { SupportedEnvironment } from '@app/common/config/Configuration';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';

export const getLoggerModule = () => {
  return LoggerModule.forRoot({
    pinoHttp: {
      genReqId: () => uuidv4(),
      level: ConfigService.isProduction() ? 'info' : 'trace',
      transport:
        ConfigService.getConfig().ENV === SupportedEnvironment.local
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                destination: 1,
              },
            }
          : undefined,
      serializers: {
        req: (req: any) => ({ body: req.raw.body, ...req }),
      },
      formatters: {
        level: (label: string) => ({ level: label }),
      },
      quietReqLogger: true,
    },
  });
};
