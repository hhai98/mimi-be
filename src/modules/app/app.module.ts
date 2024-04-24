import { Module, MiddlewareConsumer } from '@nestjs/common'
import { UsersModule } from 'modules/users/users.module'
import { AuthModule } from 'modules/auth/auth.module'
import databaseConfig from 'config/database.config'
import authConfig from 'config/auth.config'
import appConfig from 'config/app.config'
import mailConfig from 'config/mail.config'
import fileConfig from 'config/file.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfigService } from 'database/typeorm-config.service'
import { DataSource } from 'typeorm'
import { AppLoggerMiddleware } from 'middlewares/logger.middleware'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from 'modules/app/app.controller'
import { AppService } from 'modules/app/app.service'
import { APP_GUARD } from '@nestjs/core'
import { UploadModule } from 'modules/upload/upload.module'
import { FeedbacksModule } from 'modules/feedbacks/feedbacks.module'
import { StatisticModule } from 'src/modules/statistics/statistics.module'
import { CoursesModule } from 'src/modules/courses/courses.module'
import { LessonsModule } from 'src/modules/lessons/lessons.module'
import { VideosModule } from 'src/modules/videos/videos.module'
import { ScheduleModule } from '@nestjs/schedule'
import { CartsModule } from 'src/modules/carts/carts.module'
import { OrdersModule } from 'src/modules/orders/orders.module'
import { TeachersModule } from 'src/modules/teachers/teachers.module'
import { CommentsModule } from 'src/modules/comments/comments.module'
import { CourseReviewsModule } from 'src/modules/courseReviews/course-reviews.module'
import { QuestionsModule } from 'src/modules/questions/questions.module'
import { ExamsModule } from 'src/modules/exams/exams.module'
import { CombosModule } from 'src/modules/combos/combos.module'
import { PostsModule } from 'src/modules/posts/posts.module'
import { ImagesModule } from 'src/modules/images/images.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { MailConfigService } from 'modules/mail/mail-config.service'

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('app.throttleTTL'),
        limit: config.get('app.throttleLimit'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
    }),

    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),

    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    VideosModule,
    CommentsModule,
    CartsModule,
    OrdersModule,
    UploadModule,
    FeedbacksModule,
    CourseReviewsModule,
    StatisticModule,
    TeachersModule,
    QuestionsModule,
    ExamsModule,
    CombosModule,
    PostsModule,
    ImagesModule,
    ScheduleModule.forRoot(),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*')
  }
}
