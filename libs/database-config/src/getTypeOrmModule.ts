import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule } from './database-config.module';
import { DatabaseConfigService } from './database-config.service';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

export const getTypeOrmModule = () => {
  return TypeOrmModule.forRootAsync({
    imports: [DatabaseConfigModule],
    inject: [DatabaseConfigService],
    useClass: DatabaseConfigService,
    dataSourceFactory: async (options) => {
      if (!options) {
        throw new Error('Invalid options passed');
      }

      return addTransactionalDataSource(new DataSource(options));
    },
  });
};
