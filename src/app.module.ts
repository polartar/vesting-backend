import {
  Logger,
  Module,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import config from 'src/common/configs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { WalletsModule } from 'src/wallets/wallets.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VestingContractsModule } from './vesting-contracts/vesting-contracts.module';
import { VestingsModule } from './vestings/vestings.module';
import { TokensModule } from './tokens/tokens.module';
import { RecipesModule } from './recipe/recipes.module';
import { VestingTemplatesModule } from './vesting-templates/vesting-templates.module';
import { SafesModule } from './safe/safes.module';
import { WebsiteModule } from './websites/websites.module';
import { TransactionsModule } from './transactions/transactions.module';
import { EntitiesModule } from './entities/entities.module';
import { ProjectsModule } from './projects/projects.module';
import { RevokingsModule } from './revokings/revokings.module';
import { ListenerModule } from './listener/listener.module';

// Middleware
import { VestingContractsMiddleware } from './vesting-contracts/vesting-contracts.middleware';
import { VestingsMiddleware } from './vestings/vestings.middleware';

// prisma middleware
import { softDeleteMiddleware } from './common/middleware/delete.middleware';
import { loggingMiddleware } from 'src/common/middleware/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware(new Logger('PrismaMiddleware')),
          // soft delete middleware
          softDeleteMiddleware(),
        ],
      },
    }),

    AuthModule,
    UsersModule,
    WalletsModule,
    TokensModule,
    OrganizationsModule,
    VestingContractsModule,
    VestingsModule,
    RecipesModule,
    VestingTemplatesModule,
    SafesModule,
    WebsiteModule,
    TransactionsModule,
    EntitiesModule,
    ProjectsModule,
    RevokingsModule,
    ListenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VestingContractsMiddleware).forRoutes(
      { path: '/vesting-contract', method: RequestMethod.POST },
      {
        path: '/vesting-contract/:vestingContractId',
        method: RequestMethod.PUT,
      }
    );

    consumer
      .apply(VestingsMiddleware)
      .forRoutes({ path: '/vesting', method: RequestMethod.POST });
  }
}
