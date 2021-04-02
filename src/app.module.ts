import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './orm.config';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './post/post.module';
import { TokenVerificationMiddleware } from "./token-verification.middleware";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require('morgan');

@Module({
  imports: [TypeOrmModule.forRoot(pgConfig),
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    UserModule,
    ProfileModule,
    PostModule,]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(morgan('dev'))
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply( TokenVerificationMiddleware).exclude('/user/signin', 'user/signup')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
