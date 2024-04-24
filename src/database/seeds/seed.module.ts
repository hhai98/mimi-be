import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import appConfig from 'src/config/app.config'
import databaseConfig from 'src/config/database.config'
import { DataSource } from 'typeorm'
import { TypeOrmConfigService } from 'database/typeorm-config.service'
import { UserSeedModule } from 'database/seeds/user/user-seed.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
    }),
    UserSeedModule,
  ],
})
export class SeedModule {}
