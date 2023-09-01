// import { GraphQLModule } from '@nestjs/graphql';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import config from 'src/common/configs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { WalletsModule } from 'src/wallets/wallets.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { loggingMiddleware } from 'src/common/middleware/logging.middleware';

// import { GqlConfigService } from './gql-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
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
import { IndexerModule } from './indexer/indexer.module';
// import { softDeleteMiddleware } from './common/middleware/delete.middleware';

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
          // softDeleteMiddleware(),
        ],
      },
    }),

    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   useClass: GqlConfigService,
    // }),

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
    IndexerModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
